#!/bin/bash

# Configuration
ACCOUNT_ID="705476864455"
REGION="us-east-1"
REPO_NAME="deepfake-lambda"
IMAGE_TAG="latest"

# 1. Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

if [ $? -ne 0 ]; then
    echo "Error: AWS ECR Login failed. Make sure you have set your AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_SESSION_TOKEN."
    exit 1
fi

# 2. Create Repository (if it doesn't exist)
# We use || true to suppress error if repo already exists
echo "Ensuring ECR repository exists..."
aws ecr create-repository --repository-name $REPO_NAME --region $REGION || true

# 3. Build Docker Image
# NOTE: YOU MUST SET YOUR PUBLIC SUPABASE URL HERE FOR THE FRONTEND BUILD
# If you don't have a public URL yet, deployment might fail to connect to DB.
echo "Building Docker Image..."
# Prompt for Supabase URL if not set
if [ -z "$VITE_SUPABASE_URL" ]; then
    read -p "Enter your Public Supabase URL (e.g., https://xyz.supabase.co or Ngrok URL): " VITE_SUPABASE_URL
fi
if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    read -p "Enter your Supabase Anon Key: " VITE_SUPABASE_ANON_KEY
fi

docker build \
  --build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
  --build-arg VITE_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY" \
  --platform linux/amd64 \
  -f Dockerfile.lambda -t $REPO_NAME .

# 4. Tag Image
echo "Tagging image..."
docker tag $REPO_NAME:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:$IMAGE_TAG

# 5. Push Image
echo "Pushing image to ECR (This may take a while)..."
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:$IMAGE_TAG

echo "----------------------------------------------------------------"
echo "Image Pushed Successfully!"
echo "Image URI: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:$IMAGE_TAG"
echo ""
echo "Next Steps:"
echo "1. Go to AWS Lambda Console."
echo "2. Create Function -> Container Image."
echo "3. Use the Image URI above."
echo "4. Set Environment Variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD."
echo "----------------------------------------------------------------"
