/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false); 
      document.getElementById("scan").addEventListener("click", this.getBarcodePicture);
    
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        
        app.receivedEvent('deviceready');
        $('.card').hide();
       
    },
    
    getBarcodePicture: function() {
        
        $("#results").html("");
        
   		var cameraOptions = {
        	quality : 40,
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1280,
            targetHeight: 720,
        //  popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        
		navigator.camera.getPicture(app.onPictureSuccess, app.onPictureFail, cameraOptions);       
    },
    
    onPictureFail: function(message) {
		$("#results").html("Picture failed: " + message);
        $('.card').show();
	},

	onPictureSuccess: function(imageURI) {

			Quagga.decodeSingle({
				decoder: {
					readers: [ "code_39_reader", "code_39_vin_reader", "code_128_reader", "ean_reader", "ean_8_reader",
                    	"codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader" ]
			  	},
		   	 	locate: true, // try to locate the barcode in the image
                src: imageURI,
                singleChannel: true // true: only the red color-channel is read
				}, 

				function(result){

		    		if(result.codeResult) {
                        
                        app.querySPProxy(result.codeResult.code);

	    			} 
					else {
	        			$("#results").html("<p>Barcode not detected.</p>");
                        $('.card').show();
    				}
				});
	},
    
    querySPProxy: function (sku) {
        
        $("#results").html("Processing...");
        
    	$.ajax({	
        	url: 'http://jbowie.vp-dev.com/articles/barcode/'+ sku ,
        	type: 'GET', 
			success: (function(data) {
                
                data = parseFloat(data); // make sure it's an integer
                	
                if ( data > 0 ) { 
                	$("#results").html("<p><strong>SKU:</strong> " + sku + "</p> <p><strong>Price:</strong> $"  + data + "</p>");
               		$('.card').show();
                }
                else {
                    
                    $("#results").html("<p>No price.</p>");
               		$('.card').show();
                }
        	}),
			error: (function(data) {
				$("#results").html("Error accessing API.");
                $('.card').show();
        	}),
		
        });
        
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
        /*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        */

        console.log('Received Event: ' + id);
    }
};
