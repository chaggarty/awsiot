// Before running this code you need to have created a CSR on the device already and put it into the variable, along with AWS account access setup
var AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
var iot = new AWS.Iot();

// Defining Variables

var iotThing = "Room21bProjector";
var iotThingType = "PVS401D";

var params = {
  thingName: iotThing /* required */,
  attributePayload: {
    attributes: {
      Model: "PVS401D",
      PartNumber: "42-308-03",
      TenantID: "7134258834"
      /* '<AttributeName>': ... */
    },
    merge: false
  },
  // billingGroupName: 'STRING_VALUE',
  thingTypeName: iotThingType
};
iot.createThing(params, function(err, data) {
  if (err) console.log(err, err.stack);
  // an error occurred
  else
    console.log(
      "successfully created IOT device",
      data.thingArn,
      data.thingId,
      data.thingName
    ); // successful response
});

// Get IOT Endpoint, this is useful for connecting to aws IOT from the device

var params = {
  endpointType: "iot:Data-ATS"
};
iot.describeEndpoint(params, function(err, data) {
  if (err) console.log(err, err.stack);
  // an error occurred
  else console.log("iot endpoint is", data.endpointAddress); // successful response
});

// Run CSR command from device, then finish CSR from here. Format the CSR with only text, no spaces. After certificate is created it's attached to a policy. Lastly I'm outputting the PEM data for the new certificate. Ideally this should be written to a file.

var params = {
  certificateSigningRequest:
    "MIICpDCCAYwCAQAwXzELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAldJMRAwDgYDVQQHDAdNYWRpc29uMRIwEAYDVQQKDAlDb25kb3JMTEMxCzAJBgNVBAsMAklUMRAwDgYDVQQDDAc3Mzg5MzQ4MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs007Zscq1IHOQcqS5GNG5dESpuSZHFfu3+jmL9NDL6lCxkzkidQptjjYs0E1666iRR8PHlqiQs6tPJ8C8mAdb09SOeYXTlvmI3Js8kd27oCZnndOHtnx9ffnPV7zme613T0q6cV/F/Js6Kg9A+KamURN5W3v+e8+XDNEtPlb1zy2+81yL9QFzozqbhJJcb7XuyHKhVFSeYO3fNGPShK8ohqJ+iNxhs63R9zZUtRzVbAkyRaJA3b8iGA1ZFWC6yozlpWR0xpPl/g6T1oIped9Dh2Pe6CoN3EPTLDJ2tW8leGFansdCWCt1k4xe2h4RhdMGLESX9q9BBuGaQVqoMFMUwIDAQABoAAwDQYJKoZIhvcNAQELBQADggEBACiYCdMnnRRFElpm75TKDaIHP/RM+ZULCU9DebOw59I54AN5sYRAIT8W8IrIlqUwq5Il30BXIRtCskJH0tvNA/EsFWtKQoQWspLn9MIX9yPO8APeQ8ucOEmjycy8Gw/UnmzmLLle9ddJYCW+DZO4f1BUsPo5FyL3U8ETQ7COCUiTGvAm/xwm4sXltqR3BvWkMMWdituHgphMNhHSdG1/y6xn1VtFfQ+oLGC5iaeBDi0jVBLIggw7ro6oxE2nmgQQklT+ySyR2Dp8T//8/PSM/wZYRrWYMzXe8CqUmQYSBXo1tyZwggHzIYEdYRwGl+ybx5jO/5O59oRTtcMcwXtu/+Q=" /* required */,
  setAsActive: true
};
iot.createCertificateFromCsr(params, function(err, data) {
  if (err) console.log(err, err.stack);
  // an error occurred
  else console.log("certificate id is", data.certificateId); // successful response
  var certificateArn = data.certificateArn;
  var certificateId = data.certificateId;

  var params = {
    policyName: "AllowAll" /* required */,
    target: certificateArn /* required */
  };
  iot.attachPolicy(params, function(err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log("attached policy to", certificateArn, data); // successful response
  });

  // Attach Certificate to the Thing

  var params = {
    principal: certificateArn, /* required */
    thingName: iotThing /* required */
  };
  iot.attachThingPrincipal(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log('successfully attached certificate to device', data);           // successful response
  });

  // Next download the completed Certificate from AWS

  var params = {
    certificateId: certificateId /* required */
  };
  iot.describeCertificate(params, function(err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log('below is the newly created certificate, based off of the CSR, pem data:', '\n' , data.certificateDescription.certificatePem); // successful response
  });
});
