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

/** Open Maps / aGisMobile methods **/

function openMap(params){
	//mirem si el model es un iPad
	if (isOnDevice() && window.plugins && window.plugins.startApp) {
		var mapObject = {};
		if (isiPad()) {
			require(['libs/hash/sha256'], function() {
				/* proves de agismobile */
				params.user = "sgonzalo";
				// prova 1
				/*params.equipid = "1";*/
				// prova 2
				params.lat = 41.384247;
				params.lon = 2.176349;
				// prova 3
				/*params.carrer = "Balmes";
				params.municipi = "Barcelona";
				params.num = "123";*/

				mapObject.ios = getAGisMobileUrl(params);
				if (_.isEmpty(mapObject.ios)) {
					mapObject.ios = "agismobile://";
				}
				console.log(mapObject.ios);
				startAppCall(mapObject);
			});
		}
		else if (!_.isEmpty(params.address)) {
			params.address = params.address.replace(/\(/g, ', ').replace(/\)/g, ' ');
			if (isAndroid()) {
				mapObject.android = "http://maps.google.com/maps?q=" + params.address;
			} else if (isIOS()) {
				mapObject.ios = "http://maps.apple.com/?q=" + params.address;
			}
			startAppCall(mapObject);
		}
	}
}

function getAGisMobileUrl(params) {
	var urlStr = "";
	// 1- mediante equip
	if (!_.isUndefined(params.equipid)) {
		urlStr += "equip?id=" + params.equipid;
	}
	// 2- mediante coordenadas x,y
	else if (!_.isUndefined(params.lat) && !_.isUndefined(params.lon)) {
		urlStr += "position?lat=" + params.lat + "&lon=" + params.lon;
	}
	// 3- mediante calle, municipio, numero
	else if (!_.isUndefined(params.carrer) && !_.isUndefined(params.municipi) && !_.isUndefined(params.num)) {
		urlStr += "street?nom=" + params.carrer + "&municipi=" + params.municipi + "&porta=" + params.num;
	}

	if (_.isEmpty(params.user) || _.isEmpty(urlStr)) {
		return null;
	}

	return "agismobile:/" + urlStr + "&user=" + params.user + "&tokken=" + getAGisMobileTokken();
}

function getAGisMobileTokken(user) {
	var now = new Date(),
		SALT = "SECRET_" + now.getFullYear() + ((now.getMonth() < 10)?'0':'') + now.getMonth() + ((now.getDay() < 10)?'0':'') + now.getDay();
	return crypt_.sha256(user + SALT);
}

function startAppCall(mapObject) {
	window.plugins.startApp.start( function() {
	}, function() {
		execError(ERROR.ERROR_JS, "no mapa amb address: " + address);
	}, mapObject);
}

/** END Open Maps / aGisMobile methods **/


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

/* solapaments Presencias */

function comprobarPresencias(presencias, startDate, endDate){
	if(_.isNull(startDate) || _.isNull(endDate)){
		return $t();
	}
	var sDate = moment((startDate).toString(), 'YYYY-MM-DDTHH:mm:ss'),
		eDate = moment((endDate).toString(), 'YYYY-MM-DDTHH:mm:ss');

	if((sDate - eDate) > 0){
		return $.t('error.overlap.start_end');
	}
	if((sDate - eDate) === 0){
		return $.t('error.overlap.start_end_igual');
	}
	if(!_.isNull(presencias)){
		for(var i=0, length=presencias.length; i < length; i++) {
			var productiveAux = presencias[i];
			var prod_sDate = moment((productiveAux.get('starttime')).toString(), 'YYYY-MM-DDTHH:mm:ss'),
				prod_eDate = moment((productiveAux.get('endtime')).toString(), 'YYYY-MM-DDTHH:mm:ss');

			if((((sDate - prod_sDate) <= 0) && ((eDate - prod_sDate) > 0)) ||
				(((eDate - prod_eDate) >= 0) && ((sDate - prod_eDate)<0)) ||
				(((sDate - prod_sDate) > 0) && ((eDate - prod_eDate)<0))
				){
					return $.t('error.overlap.overlap_presence') + moment(prod_sDate).format("HH:mm") + "-" + moment(prod_eDate).format("HH:mm");
			}
		}
	}
	return null;
}
function comprobarIntervaloPresencias(taskCollection, intervalsNonOverlap, startDate, endDate){
	var sDate = moment((startDate).toString(), 'YYYYMMDDHHmmss'),
		eDate = moment((endDate).toString(), 'YYYYMMDDHHmmss');

	if((sDate - eDate) > 0){
		return $.t('error.overlap.start_end');
	}
	if((sDate - eDate) === 0){
		return $.t('error.overlap.start_end_igual');
	}
	if(!_.isNull(intervalsNonOverlap)){
		for(var i=0, length=intervalsNonOverlap.length; i < length; i++) {
			var productiveAux = intervalsNonOverlap[i];
			var prod_sDate = moment((productiveAux.get('startDate')).toString(), 'YYYYMMDDHHmmss'),
				prod_eDate = moment((productiveAux.get('endDate')).toString(), 'YYYYMMDDHHmmss');

			if((((sDate - prod_sDate) <= 0) && ((eDate - prod_sDate) > 0)) ||
				(((eDate - prod_eDate) >= 0) && ((sDate - prod_eDate)<0)) ||
				(((sDate - prod_sDate) > 0) && ((eDate - prod_eDate)<0))
				){
					var idTask = productiveAux.get('taskId');
					if (!_.isUndefined(idTask)) {
						var tarea =  taskCollection.findWhere({taskId:idTask}),
							deskTask = '';
						if(!_.isUndefined(tarea)){
							deskTask = tarea.get('taskDescription');
						}
						return $.t('error.overlap.overlap_1') + moment(prod_sDate).format("HH:mm") + "-" + moment(prod_eDate).format("HH:mm") + $.t('error.overlap.overlap_2') + deskTask;
					} else {
						return $.t('error.overlap.overlap_1') + moment(prod_sDate).format("HH:mm") + "-" + moment(prod_eDate).format("HH:mm") + $.t('error.overlap.overlap_3');
					}
			}
		}
	}
	return null;
}

function comprobarIntervalosTarea(taskCollection, intervalsNonOverlap, tstask){
	var self = this,
		solapa = null;
	_.each(tstask.get('tsproductivetime').models, function(tsproductive){
		solapa = comprobarIntervaloPresencias(taskCollection, intervalsNonOverlap, tsproductive.get('startDate'), tsproductive.get('endDate'));
		if(solapa !== null){
			return solapa;
		}
	}, this);
	return solapa;
}