/***************************/
/***** DATABASE CONFIG *****/
/***************************/

var DATABASE = {
	NAME: "PlayQ&A",
	VERSION: "1.0",
	DISPLAYNAME: "BD Play Q&A",
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

var app_version = '0.7.0';

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
var LS_IS_ADMIN = "ls_isadmin";
var LS_LAST_LOGIN_DATETIME = "ls_last_login_datetime";
var LS_CHANGE_PASSWORD = "ls_change_password";
var LS_EXPIRATION_DATE = "ls_expiration_date";
var LS_LANG = "ls_lang";
var LS_QUESTION_IDS = "ls_question_ids";
var LS_STAY_LOGGED = "ls_stay_logged";
var LS_PHOTO = "ls_photo";
var LS_OPPONENT = "ls_opponent";

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

