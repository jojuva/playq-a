
var PushNotification = function() {};

// Call this to register for push notifications. Content of [options] depends on whether we are working with APNS (iOS) or GCM (Android)
PushNotification.prototype.register = function(successCallback, errorCallback, options) {
    cordova.exec(successCallback, errorCallback, "PushPlugin", "register", [options]);
};

// Call this to unregister for push notifications
PushNotification.prototype.unregister = function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "PushPlugin", "unregister", []);
};


// Call this to set the application icon badge
PushNotification.prototype.setApplicationIconBadgeNumber = function(successCallback, badge) {
    cordova.exec(successCallback, successCallback, "PushPlugin", "setApplicationIconBadgeNumber", [{badge: badge}]);
};

/**
 * Load PushNotification
 */

if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.pushNotification) {
    window.plugins.pushNotification = new PushNotification();
}
