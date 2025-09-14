pipeline {
    agent any

    triggers {
        githubPush()   // Trigger when new commit happens in App Repo
    }

    environment {
        AWS_URL = "http://51.21.156.101/"
    }

    stages {
        stage('Checkout App Repo') {
            steps {
                echo '📥 Cloning App Repo...'
                git branch: 'main', url: 'https://github.com/Bhagavathsr3/conference.git'
            }
        }

        stage('Build App') {
            steps {
                echo '🔨 Building the application...'
                sh 'mvn clean install'   // or npm install / gradle build if needed
            }
        }

        stage('Checkout Test Repo') {
            steps {
                dir('tests') {
                    echo '📥 Cloning Test Repo...'
                    git branch: 'main', url: 'https://github.com/Bhagavathsr3/CiCdTestScriptsSelenium.git'
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                dir('tests') {
                    echo "▶️ Running LoginTest against ${env.AWS_URL}"
                    sh "mvn clean test -Dtest=com.nopcommerce.testcases.LoginTest -Dapp.url=${env.AWS_URL}"
                }
            }
            post {
                unsuccessful {
                    error("❌ Tests failed! Stopping pipeline. Previous build remains live.")
                }
                always {
                    junit 'tests/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Deploy to AWS') {
            when {
                branch 'main'
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                echo '✅ Tests passed! Deploying app to AWS...'
                sh './deploy.sh'
            }
        }
    }
}
