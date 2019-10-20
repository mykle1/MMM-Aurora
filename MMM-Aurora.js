/* Magic Mirror
 * Module: MMM-Aurora
 *
 * By Mykle1
 * MIT License
 */
Module.register("MMM-Aurora", {

    // Module config defaults.
    defaults: {
        pole: 'north',                      // north for Borealis, south for Australis
        useHeader: false,                   // true if you want a header
        header: "Aurora Borealis",          // Any text you want. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 0,
        initialLoadDelay: 1250,
        retryDelay: 2500,
        updateInterval: 5 * 60 * 1000,           // 5 minutes

    },


    start: function() {
        Log.info("Starting module: " + this.name);
    //    self = this;
        this.url = {};
        // Schedule update timer
        self = this;

    },
// https://stackoverflow.com/questions/13121590/steps-to-send-a-https-request-to-a-rest-service-in-node-js
// request(this.getURL(), function (error, response, body) {
//  if (!error && response.statusCode == 200) {
//    console.log(body);
//  }
// });

//  var options = {
//    url: 'https://api.github.com/repos/request/request',
//    headers: {
//     ' User-Agent': 'request'
//   }
// };

    getURL: function() {
      if (this.config.pole == 'north') {
              this.url = "https://services.swpc.noaa.gov/images/animations/ovation-north/latest.jpg";
          }
          
      if (this.config.pole == 'south') {
              this.url = "https://services.swpc.noaa.gov/images/animations/ovation-south/latest.jpg";
          }

              console.log(this.url);

    return this.url;
},


    getStyles: function() {
        return ["MMM-Aurora.css"];
    },


    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Southern lights . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


    		    // seed url with timestamp so Dom will refresh
            var wrapper = document.createElement("div");
            var image = document.createElement("img");
            var getTimeStamp = new Date().getTime();
                image.classList.add = "photo";
                image.src = this.url; // + "?seed=" + getTimeStamp;
                console.log(image.src);

            wrapper.appendChild(image);

        return wrapper;
    },

    /////  Add this function to the modules you want to control with Hello-Lucy //////

        notificationReceived: function(notification, payload) {
            if (notification === 'HIDE_AURORA') {
                this.hide(1000);
            }  else if (notification === 'SHOW_AURORA') {
                this.show(1000);
            }

        },


        processURL: function(data) {
            this.url = data;
            this.loaded = true;
        },

        scheduleUpdate: function() {
            setInterval(() => {
                this.getURL();
            }, this.config.updateInterval);
            this.getURL(this.config.initialLoadDelay);
        },

        getURL: function() {
            this.sendSocketNotification('GET_URL', this.url);
        },

        socketNotificationReceived: function(notification, payload) {
            if (notification === "URL_RESULT") {
                this.processURL(payload);

                this.updateDom(this.config.animationSpeed);
            }
            this.updateDom(this.config.initialLoadDelay);
        },

});
