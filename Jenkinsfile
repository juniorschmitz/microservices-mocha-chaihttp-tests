pipeline {
    agent {
        docker {
            image "node:8-alpine"
            args "--network=skynet"
        }
    }
    stages {
        stage("Build") {
            steps {
                sh "apk add --no-cache mongodb"
                sh "chmox +x ./scripts/dropdb.sh"
                sh "npm install"
            }
        }
        stage("Test") {
            steps {
                sh "npm run test:ci"
            }
        }
        post {
            always {
                junit 'reports/*.xml'
            }
        }
        stage("Similating PRD Button") {
            steps {
                input message: "Should go to production? (Click 'Proceed' if ok)"
                sh "echo 'Hakuna Matata!'"
            }
        }
    }
}