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
                    withCredentials([usernamePassword(credentialsId: 'harbor-credentials', usernameVariable: 'HARBOR_USER', passwordVariable: 'HARBOR_PASS')]) {
                        sh "docker login ${HARBOR_URL} -u ${HARBOR_USER} -p ${HARBOR_PASS}"
                    }
                }
            }
        }

        stage('Build with Docker Compose') {
            steps {
                script {
                    sh "docker compose -f ${DOCKER_COMPOSE_FILE} build"
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withDockerRegistry([credentialsId: 'harbor-credentials', url: "http://${HARBOR_URL}"]) {
                    sh "docker compose -f ${DOCKER_COMPOSE_FILE} push"
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

