pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = "docker-compose-build.yml"
        HARBOR_URL          = "192.168.3.81"
        SONAR_HOST_URL      = "http://192.168.3.81:10111"
        SONAR_PROJECT_KEY   = "dlink-apps"
    }

    stages {
        stage('Build & SonarQube Analysis') {
            steps {
                script {
                    dir('spring-app') {
                        sh "./gradlew classes"
                    }

                    withSonarQubeEnv('sonarqube') {
                        withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_AUTH_TOKEN')]) {
                            sh """
                            sonar-scanner \\
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY} \\
                                -Dsonar.sources=. \\
                                -Dsonar.java.binaries=\$(find . -type d -name "build" | paste -sd ",") \\
                                -Dsonar.ts.tslint.reportPaths=reports/tslint.json \\
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \\
                                -Dsonar.host.url=${SONAR_HOST_URL} \\
                                -Dsonar.login=\$SONAR_AUTH_TOKEN
                            """
                        }
                    }
                }
            }
        }

    stage('Check SonarQube Quality Gate') {
        steps {
            script {
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_AUTH_TOKEN')]) {
                    sleep 10
                    def response = sh(
                        script: """
                            curl -u "\$SONAR_AUTH_TOKEN:" \\
                            "${SONAR_HOST_URL}/api/qualitygates/project_status?projectKey=${SONAR_PROJECT_KEY}"
                        """,
                        returnStdout: true
                    ).trim()

                    def json = readJSON(text: response)
                    def qualityGateStatus = json.projectStatus.status

                    if (qualityGateStatus != "OK") {
                        error "❌ Pipeline failed due to Quality Gate failure: ${qualityGateStatus}"
                    } else {
                        echo "✅ Quality Gate passed successfully!"
                    }
                }
            }
        }
    }

    stage('Detect & Build Changed Applications from docker-compose-build.yml') {
        steps {
            script {
                // (1) `git diff` 실행하여 변경된 `image:` 라인만 추출
                def composeDiff = sh(
                    script: "git diff HEAD^ HEAD -- ${DOCKER_COMPOSE_FILE} | grep '^+.*image:' || true",
                    returnStdout: true
                ).trim()

                // (2) 변경된 라인이 없으면 스킵
                if (!composeDiff) {
                    echo "🚀 No image changes detected in ${DOCKER_COMPOSE_FILE}. Skipping build."
                    currentBuild.result = 'SUCCESS'
                    return
                }

                echo "🔍 변경된 이미지 라인:\n${composeDiff}"

                def servicesToBuild = []
                def pattern = ~/^\+\s*image:\s*(\d+\.\d+\.\d+\.\d+)\/dlink\/([^:]+):([\w\.-]+)/  // 정규식 수정

                // (3) 변경된 `image:` 라인에서 서비스명 추출
                composeDiff.eachLine { line ->
                    def matcher = (line =~ pattern)
                    if (matcher) {
                        def harborUrl = matcher[0][1]    // IP (ex: 192.168.3.81)
                        def serviceName = matcher[0][2] // 서비스명 (ex: api-gateway)
                        def versionTag = matcher[0][3]  // 버전 (ex: v2.0.4)

                        echo "✅ 변경 감지됨: Harbor=${harborUrl}, 서비스=${serviceName}, 버전=${versionTag}"

                        servicesToBuild.add(serviceName)
                    } else {
                        echo "❌ 매칭 안됨: ${line}"
                    }
                }

                // (4) 중복 제거 및 최종 빌드할 서비스 확인
                servicesToBuild = servicesToBuild.unique()
                if (servicesToBuild.isEmpty()) {
                    echo "No services need to be built. Skipping."
                    currentBuild.result = 'SUCCESS'
                    return
                }

                env.SERVICES_TO_BUILD = servicesToBuild.join(" ")
                echo "Services to build: ${env.SERVICES_TO_BUILD}"

                // (5) Docker build 실행
                sh "docker compose -f ${DOCKER_COMPOSE_FILE} build ${env.SERVICES_TO_BUILD}"
            }
        }
    }

    stage('Login & Push Changed Applications') {
        when {
            expression { env.SERVICES_TO_BUILD && env.SERVICES_TO_BUILD.trim() != "" }
        }
        steps {
            script {
                // 1) Harbor 로그인
                withCredentials([usernamePassword(credentialsId: 'harbor-access', usernameVariable: 'HARBOR_USER', passwordVariable: 'HARBOR_PASS')]) {
                    sh "docker login ${HARBOR_URL} -u ${HARBOR_USER} -p ${HARBOR_PASS}"
                }
                // 2) 이미지 푸시
                withDockerRegistry([credentialsId: 'harbor-access', url: "https://${HARBOR_URL}"]) {
                    sh "docker compose -f ${DOCKER_COMPOSE_FILE} push ${env.SERVICES_TO_BUILD}"
                }
            }
        }
    }

    stage('Update Manifests in dlink-manifests') {
        when {
            expression { env.SERVICES_TO_BUILD && env.SERVICES_TO_BUILD.trim() != "" }
        }
        steps {
            script {
                echo "🔍 SERVICES_TO_BUILD: ${env.SERVICES_TO_BUILD}"

                // (1) 서비스명 -> manifest patch 파일 매핑
                def patchMap = [
                    "api-gateway":      "gateway-patch.yaml",
                    "auth-service":     "auth-patch.yaml",
                    "alcohol-service":  "alcohol-patch.yaml",
                    "highball-service": "highball-patch.yaml",
                    "review-service":   "review-patch.yaml",
                    "pairing-service":  "pairing-patch.yaml",
                    "next-app":         "next-patch.yaml"
                ]

                // (2) Git clone & checkout
                withCredentials([usernamePassword(credentialsId: 'github-access', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh """
                    rm -rf dlink-manifests
                    git clone https://\$GIT_USER:\$GIT_PASS@github.com/ACS7th/dlink-manifests.git
                    cd dlink-manifests
                    git checkout staging
                    git config user.name "dealim"
                    git config user.email "dealimmmm@gmail.com"
                    """

                    // (3) 빌드된 이미지 정보 기반으로 manifest 업데이트
                    env.SERVICES_TO_BUILD.split(" ").each { service ->
                        def patchFile = patchMap[service]
                        def currentVersion = env."${service}_VERSION"

                        if (patchFile && currentVersion) {
                            echo "🔄 ${patchFile} 업데이트 중 (버전: ${currentVersion})"

                            sh """
                            sed -i 's|image: ${HARBOR_URL}/dlink/${service}:.*|image: ${HARBOR_URL}/dlink/${service}:${currentVersion}|' dlink-manifests/overlays/production/patches/${patchFile}
                            """
                        } else {
                            echo "⚠️ ${service}에 대한 패치 파일 또는 버전 정보 없음"
                        }
                    }

                    // (4) Git commit & push 
                    sh """
                    cd dlink-manifests
                    git add overlays/production/patches
                    git diff --cached --quiet || (git commit -m "Update image versions for CI" && git push origin staging)
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build & push to Harbor, and manifest update completed successfully!'
        }
        failure {
            echo '❌ Build failed. Check logs.'
        }
    }
}

