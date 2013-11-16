define(["underscore", "backbone.extend", "configQueue", "configPartesQueue", "models/global/taskGlobal", "models/task", "collections/taskCollections","models/global/timeSheetGlobal","models/timesheet/timeSheet", 'collections/timesheet/timeSheetCollections',"utils","pushUtils"],
    function(_, Backbone, ConfigQueue, ConfigPartesQueue, TaskGlobal, Task, TaskCollection, TimeSheetGlobal, TimeSheet, TimeSheetCollection) {
    
    var syncGotMobile = function () {};

    _.extend(syncGotMobile.prototype, {

        initDB: function (callback) {
            var self = this;
            window.db = window.openDatabase(DATABASE.NAME, DATABASE.VERSION, DATABASE.DISPLAYNAME, DATABASE.SIZE);

            require(["sync/dao/internal/TaskProgressDAO", "sync/dao/internal/MeterOperationDAO", "sync/dao/internal/TaskStatusDAO", "sync/dao/internal/TaskStatusSyncDAO", "sync/dao/master/BrandDAO", "sync/dao/master/ConfiguracionTMDAO",
                "sync/dao/master/EmplacementDAO", "sync/dao/master/GaugeDAO", "sync/dao/master/ModelDAO", "sync/dao/master/NonExecutiveMotiveDAO",
                "sync/dao/master/OperatorDAO", "sync/dao/master/ResourceDAO", "sync/dao/master/FailureTypeDAO","sync/dao/CommentDAO", "sync/dao/NonExecutiveTaskDAO", "sync/dao/OperatorTaskDAO", "sync/dao/FormDAO",
                "sync/dao/MeetingDAO", "sync/dao/MeterDAO", "sync/dao/PresenceDAO", "sync/dao/ReadingRegisterDAO", "sync/dao/TaskCommercialDAO", "sync/dao/TaskHiddenLeakDAO",
                "sync/dao/TaskDAO", "sync/dao/TaskHydraulicDAO", "sync/dao/internal/LogDAO", "sync/dao/UserHashDAO", "sync/dao/master/TimeSheetHourTypeDAO", "sync/dao/master/TimeSheetWorkDateTypeDAO",
        "sync/dao/internal/TimeSheetStatusDAO", "sync/dao/timesheet/TimeControlDAO", "sync/dao/timesheet/TimeSheetDAO", "sync/dao/timesheet/TSNoProductiveDAO", "sync/dao/timesheet/TSProductiveDAO", "sync/dao/timesheet/TSResourceDAO", "sync/dao/timesheet/TSTaskDAO"],
                function(TaskProgressDAO, MeterOperationDAO, TaskStatusDAO, TaskStatusSyncDAO, BrandDAO, ConfiguracionTMDAO, EmplacementDAO,GaugeDAO, ModelDAO, NonExecutiveMotiveDAO,
                    OperatorDAO, ResourceDAO, FailureTypeDAO, CommentDAO, NonExecutiveTaskDAO, OperatorTaskDAO, FormDAO, MeetingDAO, MeterDAO, PresenceDAO, ReadingRegisterDAO, TaskCommercialDAO, TaskHiddenLeakDAO,
                    TaskDAO, TaskHydraulicDAO, LogDAO, UserHashDAO, TimeSheetHourTypeDAO, TimeSheetWorkDateTypeDAO, TimeSheetStatusDAO, TimeControlDAO, TimeSheetDAO, TSNoProductiveDAO, TSProductiveDAO, TSResourceDAO, TSTaskDAO) {

                    //TODO Temporal -> Si la bd no està buida, no cal fer el populate
                    var empty = window.localStorage.getItem(LS_EMPTY_BD);
                    if(empty === "1"){
                        self._setFotosPath({
                            success: function(){
                                window.db.transaction(
                                 function (tx) {
                                        // internal
                                        new TaskProgressDAO(this.db).populate(tx);
                                        new MeterOperationDAO(this.db).populate(tx);
                                        new TaskStatusDAO(this.db).populate(tx);
                                        new TaskStatusSyncDAO(this.db).populate(tx);
                                        new LogDAO(this.db).populate(tx);
                                        new TimeSheetStatusDAO(this.db).populate(tx);
                                        // master
                                        new BrandDAO(this.db).populate(tx);
                                        new ConfiguracionTMDAO(this.db).populate(tx);
                                        new EmplacementDAO(this.db).populate(tx);
                                        new GaugeDAO(this.db).populate(tx);
                                        new ModelDAO(this.db).populate(tx);
                                        new NonExecutiveMotiveDAO(this.db).populate(tx);
                                        new OperatorDAO(this.db).populate(tx);
                                        new TimeSheetHourTypeDAO(this.db).populate(tx);
                                        new TimeSheetWorkDateTypeDAO(this.db).populate(tx);
                                        new ResourceDAO(this.db).populate(tx);
                                        new FailureTypeDAO(this.db).populate(tx);
                                        //altres - aplicació
                                        new CommentDAO (this.db).populate(tx);
                                        new MeetingDAO(this.db).populate(tx);
                                        new MeterDAO(this.db).populate(tx);
                                        new PresenceDAO(this.db).populate(tx);
                                        new ReadingRegisterDAO(this.db).populate(tx);
                                        new TaskCommercialDAO(this.db).populate(tx);
                                        new TaskDAO(this.db).populate(tx);
                                        new TaskHydraulicDAO(this.db).populate(tx);
                                        new NonExecutiveTaskDAO(this.db).populate(tx);
                                        new OperatorTaskDAO(this.db).populate(tx);
                                        new FormDAO(this.db).populate(tx);
                                        new UserHashDAO(this.db).populate(tx);
                                        new TaskHiddenLeakDAO(this.db).populate(tx);
                                        //Timesheet
                                        new TimeControlDAO(this.db).populate(tx);
                                        new TimeSheetDAO(this.db).populate(tx);
                                        new TSNoProductiveDAO(this.db).populate(tx);
                                        new TSProductiveDAO(this.db).populate(tx);
                                        new TSResourceDAO(this.db).populate(tx);
                                        new TSTaskDAO(this.db).populate(tx);
                                    },
                                    function (error) {
                                        // TODO log
                                        execError(ERROR.GENERIC_ERROR, 'Transaction error ' + error.code + " " + error.message);

                                    },
                                    function (tx) {
                                        callback();
                                    }
                                );
                        },
                        error: function(){
                            //error al agafar el path de IOS
                            alert("Error al agafar el path de IOS");
                        }
                        });
                    }else{
                        callback();
                    }
            });
        },

        _setFotosPath: function(options){
            //path fotos Android vs. iOs
            if(isAndroid() || !isOnDevice()){
                window.localStorage.setItem(LS_FPATH, ANDROID_PATH);
                options.success();
            }
            else if (isIOS()) {
                window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                    function(fileSystem){
                        window.localStorage.setItem(LS_FPATH,fileSystem.root.fullPath);
                        options.success();

                    },
                    function(error){
                        execError(ERROR.FILE_ERROR, JSON.stringify(error));
                        options.error();
                });
            }
        },

        /* Sync Login */

        syncroLogin: function(userLogin, callbacks) {
            Backbone.sync("create", userLogin, {
                sendData: true,
                timeout: 30000,
                success: function(response) {
                    if (response.code === CODE_ERROR_SYNC.OK) {
                        if (callbacks.success) {
                            callbacks.success(response.value);
                        }
                    } else if (callbacks.error) {
                        // error de got
                        var errorCode = (!_.isUndefined(response.value)) ? ". " + $.t('error.got_error_code') + ": " + response.value.errorMessage : undefined;
                        callbacks.error(ERROR.LOGIN_ONLINE, errorCode);
                    }
                },
                error: function (x, message) {
                    if (callbacks.error) {
                        callbacks.error(ERROR.SINCRO_LOGIN);
                    }
                }
            });
        },

        syncroChangePassword: function (userLogin, callbacks) {
            if (!isDeviceOnline()) {
                if (callbacks.error) {
                    callbacks.error(ERROR.CHANGE_PSW_ONLINE);
                }
                return;
            }

            Backbone.sync("create", userLogin, {
                sendData: true,
                timeout: 30000,
                url: URL_CHANGE_PSW,
                success: function(response) {
                    if (response.code === CODE_ERROR_SYNC.OK) {
                        if (callbacks.success) {
                            callbacks.success(response.value);
                        }
                    } else if (callbacks.error) {
                        // error de got
                        var errorCode = (!_.isUndefined(response.value)) ? ": " + response.value.errorMessage : undefined;
                        // TODO CANVIAR TIPUS ERROR !!!
                        callbacks.error(ERROR.CHANGE_PSW_ERROR_GOT, errorCode);
                    }
                },
                error: function (x, message) {
                    if (callbacks.error) {
                        callbacks.error(ERROR.CHANGE_PSW_ONLINE);
                    }
                }
            });
        },

        /* END Sync Login */

        /* Sync Tasks */

        syncroProcess: function(callbacks) {
            //TODO TEMPORAL: preguntem si es device per poder-ho fer funcionar al navegador
            if(isOnDevice() && !isDeviceOnline()) {
                execError(ERROR.SINCRO_OFFLINE);
                callbacks.error(ERROR.SINCRO_OFFLINE);
                return;
            }

            var self = this,
                taskCollection = new TaskCollection();

            taskCollection.findAnswered({
                success: function () {
                    self.syncroUpProcess(taskCollection.models, {
                        success: function() {
                            self.syncroDownProcess({
                                success: function () {
                                    hideMsgSincro();
                                    callbacks.success();

                                },
                                error: callbacks.error
                            });
                        },
                        error: callbacks.error
                    });
                },
                error: callbacks.error
            });
        },

        syncroDownProcess: function(callbacks) {
            new ConfigQueue().fetch(callbacks);
        },

        syncroUpProcess: function(tasks, callbacks){
            if (tasks.length === 0) {
                if (callbacks.success) {
                    callbacks.success();
                }
                return;
            }

            var self = this;
            var dataAnswered = _.after(tasks.length, function() {
                self.finishSyncroCall();
                if (callbacks.success) {
                    callbacks.success();
                }
            });
            var answerCallbacks = {
                success: function () { dataAnswered(); },
                error: function () {
                    if (callbacks.error) {
                        callbacks.error();
                    }
                }
            };

            _.each(tasks, function(task){
                task = _.omit(task.toJSON(), 'tasklistid');
                var taskGlobal = new TaskGlobal({task : new Task(task) });
                taskGlobal.syncroAnswer(answerCallbacks);
            });
        },

        // llamada al sincronizador para informar que se ha terminado la sincronización de subida
        finishSyncroCall: function() {
            Backbone.ajax({
                url: window.localStorage.getItem(LS_URL_WS) + URL_SET_GOT_TASKS,
                type: "GET",
                data: {},
                cache: false,
                dataType: "json",
                beforeSend: function (xhr){
                    xhr.setRequestHeader('Authorization', make_base_auth());
                }
            });
        },

        /* END Sync Tasks */
       
        /* Sync TimeSheet - Partes */

        syncroProcessGetParte: function(getParte, callbacks){
            var self = this,
                taskCollection = new TaskCollection();
            
            taskCollection.findAnswered({
                success: function () {
                    self.syncroUpProcess(taskCollection.models, {
                        success: function() {
                            self._syncroGetPartes(getParte, {
                                success: function () {
                                    hideMsgSincro();
                                    callbacks.success();
                                },
                                error: function (error) {
                                    if (callbacks.error) callbacks.error(error);
                                }
                            });
                        },
                        error: callbacks.error
                    });
                },
                error: callbacks.error
            });
        },

        _syncroGetPartes: function(getParte, callbacks){
            var configP = new ConfigPartesQueue();
            Backbone.sync("create", getParte, {
                sendData: true,
                timeout: 30000,
                success: function(response) {
                    configP.saveToDB(response, callbacks);

                },
                error: function(x, message){
                    callbacks.error();
                }
            });
        },

        syncroUpParte: function(parte, op, callbacks){
            var self = this;
            parte.prepareData(op, {
                success: function(attrs){
                    console.log(attrs.data);
                    Backbone.sync("create", parte, {
                        sendData: true,
                        attrs: attrs,
                        timeout: 30000,
                        success: function(response) {
                            callbacks.success(response);
                        },
                        error: function () {
                            execError(ERROR.SINCRO_ERROR, "Syncro Up Parte");
                            callbacks.error(ERROR.SINCRO_ERROR);
                        }
                    });
                }
            });
        },

        syncroUpPartesCollection: function(callbacks){

            if(isOnDevice() && !isDeviceOnline()) {
                execError(ERROR.SINCRO_OFFLINE);
                callbacks.error(ERROR.SINCRO_OFFLINE);
                return;
            }

            var self = this;
            
            var tsCollection = new TimeSheetCollection();
            //Tots els partes finalizados -> syncro SEND
            tsCollection.findFinalized({
                success: function() {
                    var partes = tsCollection.models;
                    if (partes.length === 0) {
                        if (callbacks.success) {
                            callbacks.success();
                        }
                        return;
                    }
                    var dataAnswered = _.after(partes.length, function() {
                        //self.finishSyncroCall();
                        if (callbacks.success) {
                            callbacks.success();
                        }
                    });
                    var answerCallbacks = {
                        success: function () { dataAnswered(); },
                        error: function () {
                            if (callbacks.error) {
                                callbacks.error();
                            }
                        }
                    };
                    _.each(partes, function(parte){
                        var timeSheetGlobal = new TimeSheetGlobal({timeSheet: new TimeSheet({timesheetid : parte.get('timesheetid')})});
                        //timesheetid : initData.timeSheetId
                        timeSheetGlobal.fetch({
                            success: function(){
                                self.syncroUpParte(timeSheetGlobal, "SEND", {
                                    success: function (){
                                        //Eliminem els partes un cop pujats
                                        timeSheetGlobal.deleteData({
                                            success: function () {
                                                callbacks.success();
                                            },
                                            error: function () {
                                                execError(ERROR.ERROR_DELETE_DATA, 'Eliminar timeSheetGlobal');
                                                callbacks.error(ERROR.ERROR_DELETE_DATA);
                                            }
                                        });
                                           
                                    },
                                    error: function (error) {
                                        if (callbacks.error) {
                                            callbacks.error(error);
                                        }
                                    }
                                });
                            },
                            error: function(){
                                //ERROR FETCH
                                execError(ERROR.ERROR_FETCH_DATA, "Fetch data TimeSheetGlobal");
                                callbacks.error();
                            }
                        });
                    });
                },
                error: function(){
                    callbacks.error();
                }
            });
        },
        
        /* END Sync TimeSheet - Partes */

        /* Empty BD */

        emptyBDProcess: function(callbacks){
            var self = this;
            this._emptyTasks({
                success: function(){
                    self._emptyMasters({
                        success:function(){
                            //posem la variable de ls empty a true=1
                            window.localStorage.setItem(LS_EMPTY_BD, "1");
                            //posem el codetm a null
                            window.localStorage.setItem(LS_CODETM, '');
                            callbacks.success();
                        },
                        error: function(){
                            if(callbacks.error) callbacks.error();
                        }
                    });
                },
                error: function (){
                    if(callbacks.error) callbacks.error();
                }
            });
        },

        _emptyMasters: function(callbacks) {
            new ConfigQueue().deleteMasters(callbacks);
        },

        _emptyTasks: function(callbacks) {
            new ConfigQueue().deleteTasks(callbacks);
        }

        /* END Empty BD */
    });

    return syncGotMobile;
});