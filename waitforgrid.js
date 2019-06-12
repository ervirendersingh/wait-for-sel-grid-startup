const http = require('http');
let hubUri;

if(process.env.HUB_ADDRESS === undefined) {
    hubUri = "http://localhost:4444/wd/hub/status"
} else {
    hubUri = process.env.HUB_ADDRESS + '/status'
}

function checkGridAvailable(retries) { 
    if(retries === undefined) {
        retries = 10
    }
    if(retries === 0) {
      throw new Error(`Retry attempt done !`);
    } 
    console.log(`Attempt to Check if Grid is Up - ${retries}`)
    return new Promise((resolve,reject) => {
        http.get(hubUri, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
              data += chunk;
            });
            resp.on('end', () => {
              const respData = JSON.parse(data)
              if(respData.value.ready === true) {
                  console.log(respData);
                  resolve();
              } else {
                  reject();
              }
            });
          
          }).on("error", (err) => {
            console.log("Error: " + err.message);
            reject(err);
          });
    })
    .then(() => {
        console.log('Grid Is Up');
    })
    .catch(function (err) {
        if(retries === 0) {
            throw new Error(`Retry attempt done ! - ${err}`)
        } else {
            return setTimeout(checkGridAvailable, 3000, retries - 1);
        }
    })
}


checkGridAvailable()
