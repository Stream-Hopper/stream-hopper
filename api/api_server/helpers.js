const fs = require('fs');

var helpers = module.exports = {
    isWindowsOS: function(){
        return process.platform == "win32";
    }
}

module.exports = helpers;