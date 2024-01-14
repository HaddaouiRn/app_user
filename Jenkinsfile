pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Étape pour récupérer le code depuis le repository GitHub
                checkout scm
            }
        }

        stage('Build') {
            steps {
                // Étape pour construire l'application
                script {
                    sh 'docker build -t app_user .'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Utiliser l'agent SSH pour se connecter au serveur Kubernetes
                    sshagent(credentials: ['kubernetes-ssh-credentials']) {
                        // Déployer MariaDB
                        sh 'kubectl apply -f mariadb-deployment.yml'
                        // Déployer l'application Node.js
                        sh 'kubectl apply -f nodejs-deployment.yml'
                    }
                }
            }
        }
    }

    post {
        always {
            // Nettoyer après le déploiement, si nécessaire
            script {
                sshagent(credentials: ['kubernetes-ssh-credentials']) {
                    sh 'kubectl delete pod -l app=app_user'
                }
            }
        }
    }
}

