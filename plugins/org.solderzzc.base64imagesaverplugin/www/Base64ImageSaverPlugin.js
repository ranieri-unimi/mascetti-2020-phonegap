//
//  Base64ImageSaverPlugin.js
//  Base64ImageSaverPlugin PhoneGap/Cordova plugin
//
//  Created by Tommy-Carlos Williams on 29/03/12.
//  Modified by Simba Zhang on 09/10/2015
//  Copyright (c) 2012 Tommy-Carlos Williams. All rights reserved.
//  MIT Licensed
//

  module.exports = {
    
    saveImageDataToLibrary:function(successCallback, failureCallback, base64Data) {
        // successCallback required
        if (typeof successCallback != "function") {
            console.log("Base64ImageSaverPlugin Error: successCallback is not a function");
        }
        else if (typeof failureCallback != "function") {
            console.log("Base64ImageSaverPlugin Error: failureCallback is not a function");
        }
        else if (typeof base64Data != "string") {
            console.log("Base64ImageSaverPlugin Error: base64Data is not a string");
        }
        else {
            var imageData = base64Data.replace(/data:image\/png;base64,/,'');
            return cordova.exec(successCallback, failureCallback, "Base64ImageSaverPlugin","saveImageDataToLibrary",[imageData]);
        }
    }
  };
  
