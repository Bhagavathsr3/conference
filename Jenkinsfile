pipeline {
    agent any
    triggers {
        githubPush()
    }
    stages {
        stage('Deploy') {
            steps {
                sh '''
                  cd /var/www/html
                  sudo rm -rf ./*
                  git clone https://github.com/Bhagavathsr3/conference.git .
                  echo "✅ Deployment complete!"
                '''
            }
        }
    }
}
