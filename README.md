# awsiot
AWS IOT Device Onboarding. Create-IOT-Device.js is the main file to run.

# Script overview
This script is designed to create an IOT Device (Thing), and create a certificate from a previously generated CSR. It takes that CSR and applies all the logic needed to associate it with the device and give it access to AWS services.

Before running this code you need to have created a CSR on the device already and put it into the variable, along with AWS account access setup

# Prereqs

npm install aws-sdk
