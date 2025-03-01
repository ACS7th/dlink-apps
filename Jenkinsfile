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
                    // (1) git diff로 변경된 파일 목록 확인
                    def changedFiles = sh(script: "git diff --name-only HEAD^ HEAD", returnStdout: true).trim().split("\n")
                    echo "Changed Files: ${changedFiles.join(', ')}"

                    // (2) docker-compose-build.yml이 변경되었는지 검사
                    if (!changedFiles.contains("${DOCKER_COMPOSE_FILE}")) {
                        echo "No changes in ${DOCKER_COMPOSE_FILE}. Skipping build."
                        currentBuild.result = 'SUCCESS'
                        return
                    }

                    // (3) 변경된 docker-compose-build.yml 내용 중 이미지 라인 파싱
                    def composeDiff = sh(
                        script: "git diff HEAD^ HEAD -- ${DOCKER_COMPOSE_FILE}",
                        returnStdout: true
                    ).trim()

                    def servicesToBuild = []
                    //  - “+image: 192.168.3.81/dlink/서비스명:버전” 형태를 찾기 위한 정규식 (추가된 라인만 탐지하려면 ^+ 사용)
                    def pattern = ~/^\+.*image:\s*${HARBOR_URL}\/dlink\/([^:]+):([\w\.]+)/

                    composeDiff.eachLine { line ->
                        def matcher = (line =~ pattern)
                        if (matcher) {
                            // matcher[0][1] => 서비스명, matcher[0][2] => 버전
                            def serviceName = matcher[0][1]
                            servicesToBuild << serviceName
                        }
                    }

                    // (4) 중복 제거 및 결과 확인
                    servicesToBuild = servicesToBuild.unique()
                    if (servicesToBuild.isEmpty()) {
                        echo "No changed service lines found in ${DOCKER_COMPOSE_FILE}. Skipping."
                        currentBuild.result = 'SUCCESS'
                        return
                    }

                    env.SERVICES_TO_BUILD = servicesToBuild.join(" ")
                    echo "Services to build: ${env.SERVICES_TO_BUILD}"

                    // (5) 실제 Docker build
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
                    // (1) docker-compose-build.yml에서 빌드된 이미지 태그 다시 파싱
                    def composeContent = readFile(DOCKER_COMPOSE_FILE)
                    def versionMap = [:]
                    composeContent.eachLine { line ->
                        def matcher = line =~ /image:\s*${HARBOR_URL}\/dlink\/([^:]+):([\w\.]+)/
                        if (matcher) {
                            def serviceName = matcher[0][1]
                            def versionTag = matcher[0][2]
                            versionMap[serviceName] = versionTag
                        }
                    }

                    // (2) 서비스명 -> 패치파일 매핑
                    def patchMap = [
                        "api-gateway":      "gateway-patch.yaml",
                        "auth-service":     "auth-patch.yaml",
                        "alcohol-service":  "alcohol-patch.yaml",
                        "highball-service": "highball-patch.yaml",
                        "review-service":   "review-patch.yaml",
                        "pairing-service":  "pairing-patch.yaml",
                        "next-app":         "next-patch.yaml"
                    ]

                    // (3) Git clone & checkout
                    withCredentials([usernamePassword(credentialsId: 'github-access', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh """
                        rm -rf dlink-manifests
                        git clone https://\$GIT_USER:\$GIT_PASS@github.com/ACS7th/dlink-manifests.git
                        cd dlink-manifests
                        git checkout staging
                        git config user.name "dealim"
                        git config user.email "dealimmmm@gmail.com"
                        """

                        // (4) 변경된 서비스들의 image 태그 업데이트
                        env.SERVICES_TO_BUILD.split(" ").each { service ->
                            def patchFile      = patchMap[service]
                            def currentVersion = versionMap[service]
                            echo "Current version for service '${service}': ${currentVersion}"

                            if (patchFile && currentVersion) {
                                sh """
                                sed -i 's|image: ${HARBOR_URL}/dlink/${service}:.*|image: ${HARBOR_URL}/dlink/${service}:${currentVersion}|' dlink-manifests/overlays/production/patches/${patchFile}
                                """
                            } else {
                                echo "No patch file or version found for service: ${service}"
                            }
                        }

                        // (5) Git commit & push
                        sh """
                        cd dlink-manifests
                        git add overlays/production/patches
                        git commit -m "Update image versions for CI"
                        git push origin staging
                        """
                    }
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

