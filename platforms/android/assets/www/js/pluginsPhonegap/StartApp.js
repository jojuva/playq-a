var StartApp = function() {};

StartApp.prototype.start = function(successCallback, errorCallback, options) {
	cordova.exec(successCallback, errorCallback, "StartApp", "startApp", [options]);
};

/**
 * Load StartApp
 */

if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.startApp) {
    window.plugins.startApp = new StartApp();
}
