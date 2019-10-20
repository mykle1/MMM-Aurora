/* Magic Mirror
 * Module: MMM-Aurora
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
var httpsRequest = require('https-request');

var options = {
    hostname: 'services.swpc.noaa.gov',
    path: '/images/animations/ovation-north/latest.jpg' // 'https://services.swpc.noaa.gov/images/animations/ovation-north/latest.jpg'// '/'
};

var header = null; // Can be a json object that needs to be passed
var form = null; // Can be a json object or a string


module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getURL: function(url) {
      httpsRequest(options, header, form, function(err, data){
          if(!err){
              console.log(data);
          }else{
              console.log(err);
                    this.sendSocketNotification('URL_RESULT', data); // result);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_URL') {
            this.getURL(payload);
        }
    }
});
