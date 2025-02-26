pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = "docker-compose-build.yml"
    }

    stages {
        stage('Login to Docker Registry') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-access', url: '']) {
                    echo "✅ Docker login successful!"
                }
            }
        }

        stage('Build with Docker Compose') {
            steps {
                script {
                    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} build"
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} push"
                }
            }
        }
    }

    post {
        success {
            echo '✅ Docker Compose build & push completed successfully!'
        }
        failure {
            echo '❌ Build failed. Check logs.'
        }
    }
}
