pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'roshan', 
                    url: 'https://github.com/aitharoshankumar/festival.git', 
                    credentialsId: 'github-creds'
            }
        }

        stage('Build Containers and Deploy Application') {
            steps {
               // dir('react-31-1-26') {
                    sh 'docker-compose down --remove-orphans || true'
                    sh 'docker-compose build'
                    sh 'docker-compose up -d'
              //  }
            }
        }
    }
}
