var SecureDeviceIdentifier = function() {};

SecureDeviceIdentifier.prototype.get = function(successCallback, errorCallback, options) {
    // options.domain, options.key
	cordova.exec(successCallback, errorCallback, "SecureDeviceIdentifier", "get", [options]);
};

/**
 * Load SecureDeviceIdentifier
 */

if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.secureDeviceIdentifier) {
    window.plugins.secureDeviceIdentifier = new SecureDeviceIdentifier();
}
