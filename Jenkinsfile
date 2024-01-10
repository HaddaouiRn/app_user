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
                // Étape pour déployer sur Kubernetes ( à ajustez en fonction du projet et du fichier kubeconfig.yaml)
                script {
                    withKubeConfig([credentialsId: 'your-kubeconfig-credentials-id', kubeconfigFile: 'kubeconfig.yaml']) {
                        sh 'kubectl apply -f kubeconfig.yaml'
                    }
                }
            }
        }
    }

    post {
        always {
            // Nettoyer après le déploiement, si nécessaire
            sh 'kubectl delete pod -l app=app_user'
        }
    }
}

