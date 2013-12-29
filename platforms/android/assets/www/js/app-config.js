/***************************/
/***** DATABASE CONFIG *****/
/***************************/

var DATABASE = {
	NAME: "PlayQ&A",
	VERSION: "1.0",
	DISPLAYNAME: "BD Play Q&A",
	//SIZE: 104857599
	SIZE: 1000000
};


/* Enum column types */
var TYPE = {
	INT : {value:"INTEGER"},
	DATE : {value:"DATETIME"},
	FLOAT: {value:"REAL"},
	TEXT : {value:"TEXT"},
	BOOLEAN : {value:"NUMERIC"},
	BLOB : {value:"BLOB"},
	ACL : {value:"ACL"}
};

var app_version = '0.5.1';

/***************************/
/****** SINCRO CONFIG ******/
/***************************/

/* local */
//var baseUrl = 'file:///android_asset/www/data/';
var baseUrl = window.location.origin + window.location.pathname.replace('index.html', '') + 'data/';
var sufixUrl = '.json';


var GET_TIMEOUT = 120000;
var POST_TIMEOUT = 120000;

/***************************/
/********* PHOTOS **********/
/***************************/

var ANDROID_PATH = 'Android/data/edu.uoc.jojuva.playqa/fotos/';
var IOS_PATH = '';

/***************************/
/********* PARSE ***********/
/***************************/

var PARSE_APP_ID = '2nYMgIyu9aOFd5cmsh0bOouDwXQKwiY05tDyYcFq';
var PARSE_JS_KEY = 'yV0miMQmosMbf2pXKQ81aD6PRVGbQfrSS8VphpQA';

/***************************/
/********* FACEBOOK ********/
/***************************/

var FB_APP_ID = '217472768376798';

/***************************/
/********* UUID IOS ********/
/***************************/

var SECURE_UUID = {
    DOMAIN: 'edu.uoc.jojuva',
    PASSWORD: 'playqa'
};

/***************************/
/**** PUSH NOTIFICATION ****/
/***************************/

var SENDER_ID = "953745891009";

/*******************************/
/****** ADMIN CREDENTIALS ******/
/*******************************/

var SECURE_WS_CREDENTIALS = 'bW9iaWxpdHl3c3VzZXI6bW9iaWxpdHl3c3VzZXI=';
var HASH_ADMIN_CREDENTIALS = '47545e3189b4ec9665c515cd11369345';

/*******************************/
/******** LOCALSTORAGE *********/
/*******************************/

var LS_URL_WS = 'ls_url_ws';
var LS_UUID = 'ls_uuid';
var LS_EMPTY_BD = 'ls_is_empty_bd';
var LS_ALIASTM = "ls_aliastm";
var LS_NOM_OPERATOR = "ls_nomoperator";
var LS_SYNC_PENDENT = "ls_sync_pendent";
var LS_MSG_SYNC_PENDENT = "ls_msg_sync_pendent";
var LS_OPERATOR_ID = "ls_operatorid";
var LS_CODETM = "ls_codetm";
var LS_FPATH = "ls_fotos_device_path";
var LS_IS_ADMIN = "ls_isadmin";
var LS_LAST_LOGIN_DATETIME = "ls_last_login_datetime";
var LS_EDIT_INIT_DATE = "ls_edit_init_date_presence";
var LS_EDIT_FINAL_DATE = "ls_edit_final_date_presence";
var LS_EDIT_INTERVAL = "ls_edit_interval_presence";
var LS_CHANGE_PASSWORD = "ls_change_password";
var LS_EXPIRATION_DATE = "ls_expiration_date";
var LS_LANG = "ls_lang";
var LS_QUESTION_IDS = "ls_question_ids";

/*******************************/
/******** SYNC - RESPOSTA ******/
/*******************************/
var SYNC = {
	SEND: "SEND",
	SAVE: "SAVE"
};

/*******************************/
/********** PAGES ID ***********/
/*******************************/

var ID_PAGE = {
	LOGIN: "login",
	SIGN_UP: "signUp",
	MENU: "menu",
	QUESTION: "question",
	WAIT: "wait",
	STATISTICS: "statistics",
	TOP10: "top10",
	ASK_CLUE: "askClue",
	ANSWER_CLUE: "answerClue",
	CLUE_RESULT: "clueResult",
	GUESS: "guess",
	END: "end",
	ERROR: "error",
	LOGS: "logs"
};



/*******************************/
/******* TABLE NAMES ***********/
/*******************************/

var TABLEDB = {
	QUESTION: 'Question',
	CATEGORY: 'Category',
	ANSWER: 'Answer'

};

/*******************************/
/********* CONSTANTS ***********/
/*******************************/

var DEFAULT_LANG = "ca";

var CODE_ERROR = {
	KO: "KO",
	OK: "OK"
};
var LOGIN_STATUS = {
	LOGIN_ONLINE:"online",
	LOGIN_OFFLINE: "offline"
};

/** ERRORS a llistar al LOG **/
var ERROR_OLD = {
	LISTA_TAREAS: "Error al listar tareas",
	DETALLE_TAREAS: "Error al mostrar detalle tarea",
	CONFIGURACION: "Error en la pantalla de Configuración",
	LOGIN_OFFLINE: "Credencials incorrectes a l'autenticació sense cobertura",
	TAREA_NOEJ: "Error al contestar tarea no ejecutada",
	TAREA_EJ: "Error al contestar tarea ejecutada",
	SINCRO_OFFLINE: "Sincronització no realitzada a causa de no tenir cobertura",
	SINCRO_ERROR: "Error en el procés de sincronització",
	LOGS: "Error al mostrar Logs"
};

/*******************************/
/******* ERROR CODES ***********/
/*******************************/

var ERROR = {
	GENERIC_ERROR: {value: "001", description:"error.generic", level:"error"},
	EXPIRATION_PSW: { value: "002", level: "info" },
	USER_NOT_EXIST: {value:"003", description:"error.userNotExists", level:"error"},
	REQUIRED_ATTRIBUTE: {value:"004", description:"error.requiredAttr", level:"error"},
	ERROR_INIT_DB: { value:"005", level:"error" },
	ERROR_JS: { value:"006", level:"error"},
	ERROR_CREATE_BD: { value:"007", level:"error"},
	ERROR_INSERT_MASTERS: { value:"008", level:"error" },
	ERROR_FETCH_DATA: { value:"009", level:"error" },
	ERROR_SAVE_DATA: { value:"010", level:"error" },
	ERROR_LOAD_PAGE_DATA: { value:"011", level:"error" },
	ERROR_LOAD_TEMPLATE: { value:"012", level:"error" },
	ERROR_DELETE_DATA: { value:"013", level:"error" },
	ERROR_DO_SEARCH: { value:"014", level:"error" },
	LOGIN_OFFLINE: { value:"015", level:"info" },
	SINCRO_OFFLINE: { value: "016", level:"info" },
	SINCRO_ERROR: { value: "017", level:"error" },
	LOGIN_ONLINE: { value: "018", level:"error"},
	SINCRO_LOGIN: { value: "019", level: "error"},
	GETHASH: { value: "020", level: "error"},
	LOGIN_OFFLINE_NO_CREDENTIALS: { value: "021", level: "info"},
	FILE_ERROR: { value: "022", level: "error"},
	SESSION_EXPIRED: { value: "023", level: "info"},
	ACCESS_DENIED: { value: "024", level: "info"},
	CHANGE_PSW_ONLINE: { value: "025", level: "error"},
	CHANGE_PSW_ERROR_GOT: { value: "026", level: "error"}
};