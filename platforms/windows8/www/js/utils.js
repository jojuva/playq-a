window.onerror = function(message, url, lineNumber) {
	require(['underscore.extend'], function( _){
		if (_.isUndefined(url)) url = "";
		//execError(ERROR.ERROR_JS, 'linia: ' + lineNumber + ' ; url: ' + url + ' ; msg: ' + message);
		console.log("Error: "+message+" in "+url+" at line "+lineNumber);
	});
};

//window.execError = function(error, errorMessage) {
//	require(["jquery", "underscore.extend", "backbone.extend", "models/internal/log", "i18n"], function($, _, Backbone, Log){
//			var log = new Log(),
//			op = $.t('error.operation.' + error.value),
//			desc = $.t('error.description.' + error.value) + ((!_.isUndefined(errorMessage) ? ' // ' + errorMessage : ''));
//			nivel = error.level;
//			log.save({Operation: op, Description: desc, Nivel: nivel }, {
//				success: function() {
//				}, error: function () {}
//			});
//	});
//};


function isOnDevice() {
	//return (window.cordova && window.device);
	return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
}

function isDeviceOnline() {
	return (isOnDevice() && !_.isUndefined(navigator.connection) && navigator.connection.type !== Connection.NONE && navigator.connection.type !== Connection.UNKNOWN);
}

function isTablet() {
	var mqw, mqh;
	if (isAndroid()) {
		mqw = window.matchMedia("(min-device-width: 800px)");
		mqh = window.matchMedia("(min-device-height: 800px)");
	} else {
		mqw = window.matchMedia("(min-device-width: 768px)");
		mqh = window.matchMedia("(min-device-height: 768px)");
	}
	var mqdpr = window.matchMedia("(-webkit-min-device-pixel-ratio: 1)");
	return (mqw.matches && mqh.matches && mqdpr.matches);
}

function isAndroid() {
	return (device.platform === "Android");
}

function isIOS() {
	return (device.platform === "iOS");
}

function isiPad() {
	//return (device.model.toLowerCase().indexOf("ipad") >= 0);
	// return (navigator.platform.indexOf("iPad") != -1);
	return (navigator.userAgent.match(/iPad/i) !== null);
}

$.urlParam = function(name) {
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return (!_.isNull(results)) ? results[1] : undefined;
};

function scroll(scrollTop) {
  $("body,html").animate({scrollTop: scrollTop});
}

/** Metodes per obtenir fitxers / fotos **/

function getPhotosPath(){
	if (isAndroid()){
		return ANDROID_PATH;
	}
	if(isIOS()){
		return IOS_PATH;
	} else {
		return '';
	}
}

function existFiles(path, callbacks){
	//mirem si h iha fitxers en el directori que ens passen
	if(isOnDevice()){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
			fileSys.root.getDirectory( path,
				{create:false, exclusive: false},
				function(dirEntry) {
					// Get a directory reader
					var directoryReader = dirEntry.createReader();
					// Get a list of all the entries in the directory
					directoryReader.readEntries(
						function(entries) {
							if(entries.length > 0){
								callbacks.success();
							}else{
								callbacks.error();
							}
						},
						function(error) { noFiles(error, callbacks); });
				},
				function(error) { noFiles(error, callbacks); });
			},
			function(error) { noFiles(error, callbacks); });
	}else{
		//TODO - treure a producció
		callbacks.error();
	}
}

function noFiles(error, callbacks){
	callbacks.error();
}

/** END Metodes per obtenir fitxers / fotos **/


/* metode per generar el Authorization header */
function make_base_auth(user, password) {
	return "Basic " + SECURE_WS_CREDENTIALS;
}


/* mobiscroll Date*/
function renderMobiscrollDate(params){
	_.each(params.inputs, function($input){
		$input.mobiscroll().date({
			theme: 'android-ics light',
			lang: window.localStorage.getItem(LS_LANG),
			display: params.display || 'modal',
			dateFormat: params.dateFormat || 'dd/mm/yy',
			dateOrder: params.dateOrder || 'ddmmyy',
			mode: 'scroller',
			minDate: params.minDate || null,
			maxDate: params.maxDate || null,
			disabled: params.disabled || false
		});
	});
}
/* time */
function renderMobiscrollTime(params){
	_.each(params.inputs, function($input){
		$input.mobiscroll().time({
			theme: 'android-ics light',
			lang: window.localStorage.getItem(LS_LANG),
			display: params.display || 'modal',
			mode: 'scroller',
			minDate: params.minDate || null,
			maxDate: params.maxDate || null,
			disabled: params.disabled || false
		});
	});
}
/* datetime */
function renderMobiscrollDateTime(params){
	_.each(params.inputs, function($input){
		$input.mobiscroll().datetime({
			theme: 'android-ics light',
			lang: window.localStorage.getItem(LS_LANG),
			display: params.display || 'modal',
			mode: 'scroller',
			minDate: params.minDate || null,
			maxDate: params.maxDate || null,
			disabled: params.disabled || false
		});
	});
}

