pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = "docker-compose-build.yml"
        HARBOR_URL = "192.168.3.81"
        SONAR_HOST_URL = "http://192.168.3.81:10111"
        SONAR_PROJECT_KEY = "dlink-apps"
    }

    stages {

        stage('Build java classes for SonarQube') {
            steps {
                script {
                    dir('spring-app') {
                        sh "./gradlew classes"
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
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

        stage('Check Sonar Qube Quality Gate') {
            steps {
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_AUTH_TOKEN')]) {
                    script {
                        def response = sh(script: """
                            sleep 10
                            curl -u "\$SONAR_AUTH_TOKEN:" \\
                                "${SONAR_HOST_URL}/api/qualitygates/project_status?projectKey=${SONAR_PROJECT_KEY}"
                        """, returnStdout: true).trim()

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

        stage('Login to Harbor') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'harbor-access', usernameVariable: 'HARBOR_USER', passwordVariable: 'HARBOR_PASS')]) {
                        sh "docker login ${HARBOR_URL} -u ${HARBOR_USER} -p ${HARBOR_PASS}"
                    }
                }
            }
        }

        stage('Detect Changed Applications') {
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

        stage('Build Changed Applications') {
            when {
                expression { env.SERVICES_TO_BUILD != null && env.SERVICES_TO_BUILD.trim() != "" }
            }
            steps {
                script {
                    sh "docker compose -f ${DOCKER_COMPOSE_FILE} build ${env.SERVICES_TO_BUILD}"
                }
            }
        }

        stage('Push Changed Applications') {
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
            echo '✅ Build & push to Harbor completed successfully!'
        }
        failure {
            echo '❌ Build failed. Check logs.'
        }
    }
}

