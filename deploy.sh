
#! /bin/bash

PROJECT_ID=digital-ucdavis-edu
CONTAINER_NAME=gh-webhook-gcb-connector
SERVICE_ACCOUNT_NAME=gh-webhook-gcb-connector@digital-ucdavis-edu.iam.gserviceaccount.com
DEPLOYMENT_NAME=$CONTAINER_NAME
IMAGE=gcr.io/$PROJECT_ID/$CONTAINER_NAME

gcloud config set project $PROJECT_ID
gcloud builds submit --tag $IMAGE

gcloud beta run deploy $DEPLOYMENT_NAME \
  --image $IMAGE \
  --platform managed \
  --memory=1Gi \
  --region=us-central1 \
  --service-account=$SERVICE_ACCOUNT_NAME