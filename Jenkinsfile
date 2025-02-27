pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = "docker-compose-build.yml"
        HARBOR_URL = "192.168.3.81"
    }

    stages {

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
                    // 변경된 파일 목록 가져오기 (최근 커밋 기준)
                    def changedFiles = sh(script: "git diff --name-only HEAD~1", returnStdout: true).trim().split("\n")

                    // 서비스별 변경 감지
                    def servicesToBuild = []
                    def serviceMappings = [
                        "api-gateway"     : "spring-app/",
                        "auth-service"    : "spring-app/",
                        "alcohol-service" : "spring-app/",
                        "highball-service": "spring-app/",
                        "review-service"  : "spring-app/",
                        "pairing-service" : "spring-app/",
                        "next-app"        : "next-app/"
                    ]

                    serviceMappings.each { service, path ->
                        if (changedFiles.any { it.startsWith(path) }) {
                            servicesToBuild.add(service)
                        }
                    }

                    if (servicesToBuild.isEmpty()) {
                        echo "No changes detected. Skipping build."
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
            echo '✅ Selected Docker Compose services build & push completed successfully!'
        }
        failure {
            echo '❌ Build failed. Check logs.'
        }
    }
}

