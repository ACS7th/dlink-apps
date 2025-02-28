pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = "docker-compose-build.yml"
        HARBOR_URL = "192.168.3.81"
        SONAR_HOST_URL = "http://192.168.3.81:10111"
        SONAR_PROJECT_KEY = "dlink-apps"
    }

    stages {
        stage('Build classes for sonar') {
            steps {
                script {
                    dir('spring-app') { // spring-app 폴더에서 Gradle 빌드
                        sh "./gradlew classes"
                    }
                }
            }
        }

        stage('SonarQube analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_AUTH_TOKEN')]) {
                        script {
                            sh """
                            sonar-scanner \
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                                -Dsonar.sources=. \
                                -Dsonar.java.binaries=\$(find . -type d -name "build" | paste -sd ",") \
                                -Dsonar.ts.tslint.reportPaths=reports/tslint.json \
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                                -Dsonar.host.url=${SONAR_HOST_URL} \
                                -Dsonar.login=\$SONAR_AUTH_TOKEN
                            """
                        }
                    }
                }
            }
        }

        stage('Quality Gate Check') {
            steps {
                script {
                    timeout(time: 1, unit: 'MINUTES') {
                        def qualityGate = waitForQualityGate()
                        if (qualityGate.status != 'OK') {
                            error "Pipeline failed due to Quality Gate failure: ${qualityGate.status}"
                        }
                    }
                }
            }
        }

        stage('Login to Harbor') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'harbor-access', usernameVariable: 'HARBOR_USER', passwordVariable: 'HARBOR_PASS')]) {
                        sh "docker login ${HARBOR_URL} -u ${HARBOR_USER} -p ${HARBOR_PASS}"
                    }
                }
            }
        }

        stage('Detect Changed Services') {
            steps {
                script {
                    def changedFiles = sh(script: "git diff --name-only HEAD^ HEAD", returnStdout: true).trim().split("\n")
                    echo "Changed Files: ${changedFiles.join(', ')}"

                    def servicesToBuild = []
                    def serviceMappings = [
                        "api-gateway"     : "spring-app/api-gateway/",
                        "auth-service"    : "spring-app/auth/",
                        "alcohol-service" : "spring-app/alcohols/",
                        "highball-service": "spring-app/highball/",
                        "review-service"  : "spring-app/review/",
                        "pairing-service" : "spring-app/pairing/",
                        "next-app"        : "next-app/"
                    ]

                    serviceMappings.each { service, path ->
                        if (changedFiles.any { it.contains(path) }) {
                            servicesToBuild.add(service)
                        }
                    }

                    if (servicesToBuild.isEmpty()) {
                        echo "No matching service changes detected. Skipping build."
                        currentBuild.result = 'SUCCESS'
                        return
                    }

                    env.SERVICES_TO_BUILD = servicesToBuild.join(" ")
                    echo "Services to build: ${env.SERVICES_TO_BUILD}"
                }
            }
        }

        stage('Build Changed Services') {
            when {
                expression { env.SERVICES_TO_BUILD != null && env.SERVICES_TO_BUILD.trim() != "" }
            }
            steps {
                script {
                    sh "docker compose -f ${DOCKER_COMPOSE_FILE} build ${env.SERVICES_TO_BUILD}"
                }
            }
        }

        stage('Push Changed Services') {
            when {
                expression { env.SERVICES_TO_BUILD != null && env.SERVICES_TO_BUILD.trim() != "" }
            }
            steps {
                withDockerRegistry([credentialsId: 'harbor-access', url: "https://${HARBOR_URL}"]) {
                    sh "docker compose -f ${DOCKER_COMPOSE_FILE} push ${env.SERVICES_TO_BUILD}"
                }
            }
        }
    }

    post {
        success {
            echo '✅ Docker Compose build & push to Harbor completed successfully!'
        }
        failure {
            echo '❌ Build failed. Check logs.'
        }
    }
}

