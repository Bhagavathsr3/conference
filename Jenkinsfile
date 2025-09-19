pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        AWS_URL = "http://51.21.156.101/"
    }

    stages {

        stage('Checkout App Repo') {
            steps {
                dir('app') {
                    echo '📥 Cleaning and cloning App Repo...'
                    deleteDir()
                    git branch: 'main', url: 'https://github.com/Bhagavathsr3/conference.git'
                }
            }
        }

        stage('Checkout Test Repo') {
            steps {
                dir('tests') {
                    echo '📥 Cleaning and cloning Test Repo...'
                    deleteDir()
                    git branch: 'master', url: 'https://github.com/Bhagavathsr3/CiCdTestScriptsSelenium.git'
                }
            }
        }

        stage('Run Selenium HomeTest') {
            steps {
                dir('tests') {
                    echo "▶️ Running HomeTest against ${env.AWS_URL} in headless mode"
                    sh "mvn test -Dtest=com.Conference.TestPage.HomeTest -Dapp.url=${env.AWS_URL} -Dheadless=true"
                }
            }
            post {
                success {
                    echo "✅ Tests passed! Proceeding to deploy..."
                }
                failure {
                    error("❌ HomeTest failed! Pipeline stopped. Previous build remains live.")
                }
                always {
                    junit 'tests/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Deploy to AWS') {
            when {
                expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
            }
            steps {
                dir('app') {
                    echo '🚀 Deploying app to AWS live server...'
                    sh './deploy.sh'
                }
            }
        }
    }
}
