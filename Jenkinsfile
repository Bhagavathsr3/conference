pipeline {
    agent any

    triggers {
        githubPush()   // Trigger on new commit to App Repo
    }

    environment {
        AWS_URL = "http://51.21.156.101/"   // Your EC2 Elastic IP
    }

    stages {
        // -------------------------------
        // Checkout App Repo
        // -------------------------------
        stage('Checkout App Repo') {
            steps {
                echo '📥 Cloning App Repo...'
                git branch: 'main', url: 'https://github.com/Bhagavathsr3/conference.git'
            }
        }

        // -------------------------------
        // Checkout Test Repo
        // -------------------------------
        stage('Checkout Test Repo') {
            steps {
                dir('tests') {
                    echo '📥 Cloning Test Repo...'
                    git branch: 'master', url: 'https://github.com/Bhagavathsr3/CiCdTestScriptsSelenium.git'
                }
            }
        }

        // -------------------------------
        // Run Selenium Tests
        // -------------------------------
        stage('Run Selenium Tests') {
            steps {
                dir('tests') {
                    echo "▶️ Running Selenium tests against ${env.AWS_URL}"
                    sh "mvn clean test -Dtest=com.Conference.TestPage.HomeTest -Dapp.url=${env.AWS_URL}"
                }
            }
            post {
                unsuccessful {
                    error("❌ Tests failed! Pipeline stopped. Previous build remains live.")
                }
                always {
                    junit 'tests/target/surefire-reports/*.xml'
                }
            }
        }

        // -------------------------------
        // Deploy to AWS
        // -------------------------------
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
