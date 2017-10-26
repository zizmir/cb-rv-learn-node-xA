const color = require('colors');
const moment = require('moment');
let dateNow = moment().format('MMMM Do YYYY, h:mm:ss');

module.exports = {

  info: function(str , data) {
  	
  	console.log(`[${dateNow}] INFO :: ${str} ${data}`);
  },

  error: function(data){
  
    console.log(`[${dateNow}] INFO :: ${data} doesn't exist`.red);
  }

}
