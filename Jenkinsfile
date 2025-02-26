pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = "docker-compose.yml"
    }

    stages {

        stage('Build Docker Images') {
            steps {
                script {
                    bat "docker compose -f ${DOCKER_COMPOSE_FILE} build"
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    withDockerRegistry([credentialsId: "docker-hub-credentials", url: ""]) {
                        bat "docker compose -f ${DOCKER_COMPOSE_FILE} push"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Docker Compose build & push completed successfully!"
        }
        failure {
            echo "❌ Build failed. Check logs."
        }
    }
}

