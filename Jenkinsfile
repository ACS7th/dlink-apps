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
                    def changedFiles = sh(script: "git diff --name-only HEAD~1", returnStdout: true).trim().split("\n")

                    def filteredFiles = changedFiles.findAll { 
                        it.endsWith(".java") || it.endsWith(".yml") || it.endsWith("Dockerfile")
                    }

                    if (filteredFiles.isEmpty()) {
                        echo "No relevant changes detected. Skipping build."
                        currentBuild.result = 'SUCCESS'
                        return
                    }

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

                    serviceMappings.each { service, path ->
                        if (filteredFiles.any { it.startsWith(path) }) {
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
            matrix {
                axes {
                    axis {
                        name 'SERVICE'
                        values env.SERVICES_TO_BUILD.split(" ")
                    }
                }
                stages {
                    stage("Build $SERVICE") {
                        steps {
                            script {
                                sh "docker compose -f ${DOCKER_COMPOSE_FILE} build ${SERVICE}"
                            }
                        }
                    }
                }
            }
        }

        stage('Push Changed Services') {
            when {
                expression { env.SERVICES_TO_BUILD != null && env.SERVICES_TO_BUILD.trim() != "" }
            }
            matrix {
                axes {
                    axis {
                        name 'SERVICE'
                        values env.SERVICES_TO_BUILD.split(" ")
                    }
                }
                stages {
                    stage("Push $SERVICE") {
                        steps {
                            withDockerRegistry([credentialsId: 'harbor-access', url: "https://${HARBOR_URL}"]) {
                                sh "docker compose -f ${DOCKER_COMPOSE_FILE} push ${SERVICE}"
                            }
                        }
                    }
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

