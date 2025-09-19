pipeline {
    agent any

    triggers {
        githubPush()   // Auto trigger on repo push
    }

    environment {
        AWS_URL = "http://51.21.156.101/"   // Your EC2 app URL
        EC2_IP  = "51.21.156.101"           // Your EC2 public IP
    }

    stages {

        stage('Checkout App Repo') {
            steps {
                dir('app') {
                    echo '📥 Cloning App Repo...'
                    deleteDir()
                    git branch: 'main', url: 'https://github.com/Bhagavathsr3/conference.git'
                }
            }
        }

        stage('Checkout Test Repo') {
            steps {
                dir('tests') {
                    echo '📥 Cloning Test Repo...'
                    deleteDir()
                    git branch: 'master', url: 'https://github.com/Bhagavathsr3/CiCdTestScriptsSelenium.git'
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                dir('tests') {
                    echo "▶️ Running HomeTest against ${env.AWS_URL}"
                    sh "mvn test -Dtest=com.Conference.TestPage.HomeTest -Dapp.url=${env.AWS_URL} -Dheadless=true"
                }
            }
            post {
                always {
                    junit 'tests/target/surefire-reports/*.xml'
                }
                unsuccessful {
                    error("❌ Tests failed, stopping pipeline.")
                }
            }
        }

        stage('Deploy to AWS') {
           
            steps {
                echo "🚀 Deploying app directly from Jenkinsfile..."

                // Use Jenkins Credentials for EC2 SSH key (never commit PEM in repo)
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'KEYFILE')]) {
                    sh """
                        echo "📤 Copying app files to EC2..."
                        scp -i $KEYFILE -o StrictHostKeyChecking=no -r app/*.html app/*.css app/*.js ubuntu@${EC2_IP}:/var/www/html/

                        echo "🔄 Restarting Nginx..."
                        ssh -i $KEYFILE -o StrictHostKeyChecking=no ubuntu@${EC2_IP} "sudo systemctl restart nginx"

                        echo "✅ Deployment successful!"
                    """
                }
            }
        }
    }
}
