# stop script on error
set -e

# Check to see if root CA file exists, download if not
if [ ! -f ./root-CA.crt ]; then
  printf "\nDownloading AWS IoT Root CA certificate from AWS...\n"
  curl https://www.amazontrust.com/repository/AmazonRootCA1.pem > root-CA.crt
fi

# install AWS Device SDK for NodeJS if not already installed
if [ ! -d ./node_modules ]; then
  printf "\nInstalling AWS SDK...\n"
  npm install aws-iot-device-sdk
fi

# run pub/sub sample app using certificates downloaded in package
printf "\nRunning pub/sub sample application...\n"
node node_modules/aws-iot-device-sdk/examples/device-example.js --host-name=a2g0n0vqjsly1f-ats.iot.us-west-2.amazonaws.com --private-key=awsiotcert.pem --client-certificate=%client-cert% --ca-certificate=root-CA.crt --client-id=sdk-nodejs-79c87461-ad01-41bc-867d-4fb1da60ea6ca60ea6c