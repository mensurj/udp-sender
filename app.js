var buffer = require('buffer');
var udp = require('dgram');
const _ = require("lodash");

var data = require('./10000r-athena.json');
// creating a client socket
var client = udp.createSocket('udp4');

let obj = _.sortBy(data, "deviceid");
obj = _.groupBy(obj, "deviceid");

// for(var i = 0; i< data.length; i++){
//   obj[data[i].deviceid] = obj[data[i].deviceid] ? [...obj[data[i].deviceid], data[i].rawdata] : [data[i].rawdata];
// }

let promises = {};

let startTime = Date.now();

let k=0;
(async()=>{
  Object.keys(obj).forEach(async (key) => {

    for(var i = 0; i< obj[key].length; i++){
      try {
        let r = await send(obj[key][i].rawdata);
      } catch (error) {
        console.log(error);
      }
    }
  })
})()
function send(msg){
  return new Promise((resolve, reject)=>{
    var data = Buffer.from(msg, "hex");
    client.send(data,20501,'localhost',function(error,cb){
      if(error){
        console.log("ERRRRRRRRRR");
        reject();
      }else{
        // resolve()
        setTimeout(resolve, 200);
      }
    });
  })
}
let counter = 0;
// client.on("message", () =>{
//   console.log('1');

// })

async function sleep(sec){
  return new Promise((resolve,reject)=>{
    setTimeout(resolve,sec * 1000);
  })
}

client.on('message',function(msg,info){
  counter++
  if(counter % 100 == 0){
    console.log(counter)
  }
  if(counter == k){
    console.log("Time:" ,Date.now() - startTime)
  }
});