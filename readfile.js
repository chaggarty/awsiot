var fs = require('fs');

function readWriteAsync() {
  fs.readFile('basestart.sh', 'utf-8', function(err, data){
    if (err) throw err;

    var newValue = data.replace('%private-key%', 'awsiotcert.pem');
    var newValue2 = data.replace('%client-cert%', 'awsiotcertificate.pem');

    fs.writeFile('start.sh', newValue, 'utf-8', function (err) {
      if (err) throw err;
      console.log('filelistAsync complete');
    });
    fs.writeFile('start.sh', newValue2, 'utf-8', function (err) {
        if (err) throw err;
        console.log('filelistAsync complete 2');
      });
  });
}

readWriteAsync();
