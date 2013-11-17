/* javascripts */
var scriptCordova = document.createElement('script');
scriptCordova.type = 'text/javascript';

var scriptSecureDeviceIdentifier = document.createElement('script');

if (navigator.userAgent.toLowerCase().match(/iphone/) || navigator.userAgent.toLowerCase().match(/ipad/)) {
	scriptCordova.src= "js/libs/phonegap/cordova.ios-2.8.1.js";
}
else if (navigator.userAgent.toLowerCase().match(/android/)) {
	scriptCordova.src= "js/libs/phonegap/cordova.js";
} else {
	scriptCordova.src= "js/libs/phonegap/cordova-2.5.0.js";
}

document.getElementsByTagName('head')[0].appendChild(scriptCordova);

/* plugins */

var scriptPluginPush = document.createElement('script');
scriptPluginPush.type = 'text/javascript';
scriptPluginPush.src = 'js/pluginsPhonegap/PushNotification.js';
document.getElementsByTagName('head')[0].appendChild(scriptPluginPush);

var scriptStartApp = document.createElement('script');
scriptStartApp.type = 'text/javascript';
scriptStartApp.src = 'js/pluginsPhonegap/StartApp.js';
document.getElementsByTagName('head')[0].appendChild(scriptStartApp);

if (navigator.userAgent.toLowerCase().match(/iphone/) || navigator.userAgent.toLowerCase().match(/ipad/)) {
    var scriptSecureDeviceIdentifier = document.createElement('script');
    scriptSecureDeviceIdentifier.type = 'text/javascript';
    scriptSecureDeviceIdentifier.src = 'js/pluginsPhonegap/SecureDeviceIdentifier.js';
    document.getElementsByTagName('head')[0].appendChild(scriptSecureDeviceIdentifier);
}

/* css */
var linkMediaQueries = document.createElement('link');
linkMediaQueries.rel = "stylesheet";
linkMediaQueries.type = "text/css";
linkMediaQueries.href = "css/gotmobile/tablet.css";

if (navigator.userAgent.toLowerCase().match(/iphone/) || navigator.userAgent.toLowerCase().match(/ipad/)) {
	linkMediaQueries.media = "screen and (min-device-width : 768px) and (min-device-height : 768px) and (-webkit-min-device-pixel-ratio: 1)";
} else {
	linkMediaQueries.media = "screen and (min-device-width : 800px) and (min-device-height : 800px) and (-webkit-min-device-pixel-ratio: 1)";
}

document.getElementsByTagName('head')[0].appendChild(linkMediaQueries);