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
                    // Construire les images avec Docker Compose
                    sh 'docker compose up --build -d'

                    // Tagging des images pour le registre DockerHub
                    sh 'docker tag mariadb haddaouirania/mariadb_container:latest'
                    sh 'docker tag nodejs haddaouirania/app_user_web_container:latest'
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerHubCredentials') {
                    
                        def dbImage = docker.build("haddaouirania/mariadb_container:latest")
                        dbImage.push()
                    
                        def appImage = docker.build("haddaouirania/app_user_web_container:latest")
                        appImage.push()
        
                    }
                }

            }
        }

        stage('Transfer Deployment Files') {
            steps {
                script {
                
                    sh 'ssh -vvv -o StrictHostKeyChecking=no rania@10.0.2.15 true'
                    // Utiliser l'agent SSH pour transférer les fichiers de déploiement
                    sshagent(credentials: ['kubernetes-ssh-credentials']) {
                        // Transférer le fichier mariadb-deployment.yml
                        sh 'scp mariadb-deployment.yml rania@10.0.2.15:/home/rania'
                        // Transférer le fichier nodejs-deployment.yml
                        sh 'scp nodejs-deployment.yml rania@10.0.2.15:/home/rania'
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Utilisation de l'agent SSH pour se connecter au serveur Kubernetes
                    sshagent(credentials: ['kubernetes-ssh-credentials']) {
                        // Déployer MariaDB
                        sh 'ssh rania@10.0.2.15 "kubectl apply -f /home/rania/mariadb-deployment.yml"'
                        // Déployer l'application Node.js
                        sh 'ssh rania@10.0.2.15 "kubectl apply -f /home/rania/nodejs-deployment.yml"'
                    }
                }
            }
        }
    }

    post {
        always {
            // Nettoyage après le déploiement
            script {
                sshagent(credentials: ['kubernetes-ssh-credentials']) {
                    sh 'ssh rania@10.0.2.15 "kubectl delete pod -l app=app_user"'
                }
            }
        }
    }
}

