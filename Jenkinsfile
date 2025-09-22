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
                   sh "mvn test -DsuiteXmlFile=src/test/resources/suites/regression.xml -Dapp.url=${env.AWS_URL} -Dheadless=true"

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

        withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'KEYFILE')]) {

            // Step 1: Copy files to a temp folder on EC2 (user-writable)
            sh('scp -i ' + KEYFILE + ' -o StrictHostKeyChecking=no -r app/*.html app/*.css app/*.js ubuntu@' + EC2_IP + ':/tmp/')

            // Step 2: Move files to /var/www/html/ with sudo and restart Nginx
            sh('ssh -i ' + KEYFILE + ' -o StrictHostKeyChecking=no ubuntu@' + EC2_IP + ' "sudo mv /tmp/* /var/www/html/ && sudo systemctl restart nginx"')

            echo "✅ Deployment successful!"
        }
    }
}

    }
}
