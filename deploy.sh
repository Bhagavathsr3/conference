#!/bin/bash

# -------------------------------
# Configurations
# -------------------------------
KEY_PATH="./myTest.pem"                # .pem file in repo root
EC2_USER="ubuntu"                      # EC2 username
EC2_IP="51.21.156.101"                 # Elastic IP of your EC2 instance
REMOTE_DIR="/var/www/html/"            # Default Nginx web root

# -------------------------------
# Copy all files to EC2
# -------------------------------
echo "📤 Deploying HTML/CSS app to EC2..."
scp -i $KEY_PATH -o StrictHostKeyChecking=no -r * $EC2_USER@$EC2_IP:$REMOTE_DIR

# -------------------------------
# Restart Nginx
# -------------------------------
echo "🔄 Restarting Nginx..."
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $EC2_USER@$EC2_IP "sudo systemctl restart nginx"

echo "✅ Deployment completed!"
