pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = "docker-compose-build.yml"
        HARBOR_URL = "192.168.3.81"
    }

    stages {
         stage('SonarQube analysis') {
             steps {
                 withSonarQubeEnv('sonarqube') {
			echo 'complete'
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
                        "auth-service"    : "spring-app/auth-service/",
                        "alcohol-service" : "spring-app/alcohol-service/",
                        "highball-service": "spring-app/highball-service/",
                        "review-service"  : "spring-app/review-service/",
                        "pairing-service" : "spring-app/pairing-service/",
                        "next-app"        : "next-app/"
                    ]

                    // 변경된 파일이 속한 서비스만 리스트에 추가
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

                    // 환경 변수로 빌드할 서비스 전달
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
