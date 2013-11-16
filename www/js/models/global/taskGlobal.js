define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend', 'utils', 'uuidUtils', "models/task", "collections/meterCollections", "collections/readingRegisterCollections", "collections/meetingCollections", "collections/taskCommercialCollections", "collections/commentCollections", "collections/formCollections", "collections/operatorTaskCollections", "collections/nonExecutiveTaskCollections", "collections/presenceCollections", "collections/internal/progressCollections", "models/taskHiddenLeak"],
	function($, _, Backbone, stickit, utils, UUIDUtils, Task, MeterCollections, ReadingRegisterCollections, MeetingCollections, TaskCommercialCollections, CommentCollections, FormCollections, OperatorTaskCollections, NonExecutiveTaskCollections, PresenceCollections, ProgressCollections, TaskHiddenLeak) {

		var TaskGlobal = Backbone.Model.extend({

			url: 'taskService/sendTask',
			defaults: {
				comments: null,
				meetings: null,
				meter: null,
				presence: null,
				readingRegister: null,
				task: null,
				commercials: null,
				taskHydraulic: null,
				form: null,
				operatorTask: null,
				nonExecutiveTask: null,
				progressTask: null,
				//taskHiddenLeak: null,
				serialnumber: null /* numero de serie del contador que toca pintar al detalle de la tasca */
				
			},

			isEmptyTask: function () {
				return (_.isNull(task));
			},

			_getData: function(options){
				var dataLoaded = _.after(12, options.success),
				attrs = this.attributes,
				idMeter,
				self = this;
				loadCallbacks = {
					success: function () { dataLoaded(); },
					error: options.error
				};

				if(!_.isNull(attrs.task) && !_.isNull(idTask = attrs.task.id)){

					attrs.task.fetch(loadCallbacks);
					//lecturas
					attrs.readingRegister = new ReadingRegisterCollections();
					attrs.readingRegister.findByTask(idTask, loadCallbacks);
					//citas
					attrs.meetings = new MeetingCollections();
					attrs.meetings.findByTask(idTask, loadCallbacks);
					//deudas
					attrs.commercials = new TaskCommercialCollections();
					attrs.commercials.findByTask(idTask, loadCallbacks);
					//comentarios
					attrs.comments = new CommentCollections();
					attrs.comments.findByTask(idTask, loadCallbacks);
					//contadores
					attrs.meter = new MeterCollections();
					attrs.meter.findByTask(idTask, {
						success: function () {
							if(!attrs.meter.isEmpty()){
								attrs.serialnumber = self._currentMeter();
							}
							dataLoaded();
						},
						error: options.error
					});
					//forms
					attrs.form = new FormCollections();
					attrs.form.findByTask(idTask, loadCallbacks);
					//presence
					attrs.presence = new PresenceCollections();
					attrs.presence.findByTask(idTask, loadCallbacks);
					//operatorTask
					attrs.operatorTask = new OperatorTaskCollections();
					attrs.operatorTask.findByTask(idTask, loadCallbacks);
					//nonExecutiveTask
					attrs.nonExecutiveTask = new NonExecutiveTaskCollections();
					attrs.nonExecutiveTask.findByTask(idTask, loadCallbacks);
					//hiddenLeaks
					attrs.taskHiddenLeak = new TaskHiddenLeak({taskid : idTask});
					attrs.taskHiddenLeak.fetch(loadCallbacks);
					//progress collection - buida inicialment
					attrs.progressTask = new ProgressCollections();
					attrs.progressTask.findByTask(idTask, loadCallbacks);
				}
			},

			_currentMeter: function(){
				var meter = null;
				if(this.attributes.meter.length > 1){
					meter = this.attributes.meter.findWhere({operation: METEROPERATION.RETIRAR});
					return meter.get('serialnumber');
				}else{
					meter =  this.attributes.meter.first();
					return meter.get('serialnumber');
				}
			},

			fetch: function(options) {
				var self = this;
				this._getData({
					success: function() {
						self.trigger("dataFetch");
						if(options && options.success) options.success();
					},
					error: function () {
						if(options && options.error) options.error();
					}
				});
			},

			_deleteData: function(callbacks) {
				var attrs = this.attributes;

				//Si la tasca no es finalitzada, no hem de borrar
				if(attrs.task.get('tmstatus') !== TASKSTATUSSYNC.FINALIZADA){
					if(!_.isUndefined(callbacks)){
						callbacks.success();
					}
					return;
				}

				var	commentsDAO = new attrs.comments.dao(window.db),
					readingRegisterDAO = new attrs.readingRegister.dao(window.db),
					meetingDAO = new attrs.meetings.dao(window.db),
					presenceDAO = new attrs.presence.dao(window.db),
					taskDAO = new attrs.task.dao(window.db),
					operatorTaskDAO = new attrs.operatorTask.dao(window.db),
					taskCommercialDAO = new attrs.commercials.dao(window.db),
					formDAO = new attrs.form.dao(window.db),
					nonExecutiveTaskDAO = new attrs.nonExecutiveTask.dao(window.db),
					meterDAO = new attrs.meter.dao(window.db),
					progressDAO = new attrs.progressTask.dao(window.db);

					//Eliminem tota la tasca i els registres de les taules relacionades
					window.db.transaction(
					function (tx) {
						formDAO.deleteRowByTask(tx, attrs.task.id);
						operatorTaskDAO.deleteRowByTask(tx, attrs.task.id);
						nonExecutiveTaskDAO.deleteRowByTask(tx, attrs.task.id);
						meterDAO.deleteRowByTask(tx, attrs.task.id);
						taskCommercialDAO.deleteRowByTask(tx, attrs.task.id);
						commentsDAO.deleteRowByTask(tx, attrs.task.id);
						readingRegisterDAO.deleteRowByTask(tx, attrs.task.id);
						meetingDAO.deleteRowByTask(tx, attrs.task.id);
						presenceDAO.deleteRowByTask(tx, attrs.task.id);
						progressDAO.deleteData(tx, attrs.task.id);
						taskDAO.deleteRow(tx, attrs.task);
					},
					function (error) { callbacks.error(error.code); },
					function () { callbacks.success(); }
				);

			},

			_saveData: function(callbacks) {
				var attrs = this.attributes,
					presenceDAO = new attrs.presence.dao(window.db),
					taskDAO = new attrs.task.dao(window.db),
					operatorTaskDAO = new attrs.operatorTask.dao(window.db),
					meterDAO = new attrs.meter.dao(window.db),
					formDAO = new attrs.form.dao(window.db),
					progressDAO = new attrs.progressTask.dao(window.db);

				window.db.transaction(
					function (tx) {
						taskDAO.saveData(tx, attrs.task);
						if (!_.isNull(presenceDAO)) {
							presenceDAO.saveData(tx, attrs.presence, attrs.task.id);
						}
						if(!_.isNull(operatorTaskDAO)){
							operatorTaskDAO.saveData(tx, attrs.operatorTask, attrs.task.id);
						}
						if(!_.isNull(meterDAO)){
							meterDAO.saveData(tx, attrs.meter, attrs.task.id);
						}
						if(!_.isNull(formDAO)){
							formDAO.saveData(tx, attrs.form);
						}
						if(!_.isNull(progressDAO)){
							//netegem el que hi havia abans
							progressDAO.deleteData(tx, attrs.task.id);
							progressDAO.saveData(tx, attrs.progressTask);
						}
					},
					function (error) { callbacks.error(error.code); },
					function () { callbacks.success(); }
				);
			},

			_saveTaskData: function(callbacks) {
				var attrs = this.attributes,
					taskDAO = new attrs.task.dao(window.db);

				window.db.transaction(
					function (tx) {
						taskDAO.saveData(tx, attrs.task);
					},
					function (error) { callbacks.error(error.code); },
					function () { callbacks.success(); }
				);
			},

			initTask: function (options) {
				var self = this;
				this._saveTaskData({
					success: function() {
						if(options.success) options.success();
					},
					error: function () {
						if(options.error) options.error();
					}
				});
			},

			save: function(options) {
				var options = options || {},
					self = this;
				// Get data
				this._saveData({
					success: function() {
						//TODO TEMPORAL: preguntem si es device per poder-ho fer funcionar al navegador
						if(isOnDevice()){
							if (!isDeviceOnline()) {
								execError(ERROR.SINCRO_OFFLINE);
								options.error(ERROR.SINCRO_OFFLINE);
								return;
							}
						}
						self._syncData(SYNC.SAVE, options);
					},
					error: function () {
						execError(ERROR.ERROR_SAVE_DATA);
						options.error(ERROR.ERROR_SAVE_DATA);
					}
				});
			},

			syncroAnswer: function(options) {
				var options = options || {},
					self = this;

				self.fetch({
					success: function(){
						self._syncData(SYNC.SEND, {
							success: function() {
								options.success();
							},
							error: options.error
						});

					},error: function(){
						execError(ERROR.ERROR_FETCH_DATA);
						options.error(ERROR.ERROR_FETCH_DATA);
					}
				});
			},

			answer: function(options) {
				var options = options || {},
					self = this;
				// Save data
				//fem la validacio
				if(options.validate === true && !this.validateFields()){
					return;
				}

				this._saveData({
					success: function() {

						if (!isDeviceOnline()) {
							execError(ERROR.SINCRO_OFFLINE);
							options.error(ERROR.SINCRO_OFFLINE);
							return;
						}

						self._syncData(SYNC.SEND, {
							success: function() {
								require(['syncGotMobile'], function(SyncGotMobile) {
									new SyncGotMobile().finishSyncroCall();
									options.success();
								});
							},
							error: options.error
						});
					},
					error: function () {
						execError(ERROR.ERROR_SAVE_DATA);
						options.error(ERROR.ERROR_SAVE_DATA);
					}
				});

			},

			validateFields: function(){
				var errors = {},
					self = this,
					forms = this.get('form');

				if(self.get('task').get("status") !== TASKSTATUS.NONEXECUTIVE) {
					_.extend(errors, self._validateMeters(forms));
					_.extend(errors, self._validateTaskAttr(forms));
					_.extend(errors, self._validateFugas(forms));
				}
				else{
					if(_.isNull(self.get('task').get("nonexecutivemotiveid")) || _.isUndefined(self.get('task').get("nonexecutivemotiveid")) || _.isEmpty(self.get('task').get("nonexecutivemotiveid"))){
						var err_motivo = { motivo: "error.motivoObligatorio"};
						_.extend(errors, err_motivo);
					}
				}
				
				_.extend(errors, self._validateOperator());
				_.extend(errors, self._validateDuration());

				if(!_.isEmpty(errors)) {
					self.trigger('invalid', errors);
					return false;
				}else{
					return true;
				}
			},

			_validateMeters: function (forms) {
				var errors = {},
					meterIns = forms.findWhere({formcode: PESTANYAS.FCONTADORINSTALADO}),
					meterUnins = forms.findWhere({formcode: PESTANYAS.FCONTACTUALRETIRADO});

				if(!_.isUndefined(meterIns) || !_.isUndefined(meterUnins)) {
					this.get('meter').each(function(meter){
						var prefix = meter.getIdPrefix();
						var metererrors = meter.validate();
						var auxErrors = {};
						_.each(metererrors, function(value, key) {
							auxErrors[prefix + key] = value;
						});
						_.extend(errors, auxErrors);
					});
				}

				return errors;
			},

			_validateTaskAttr: function (forms) {
				var attributes = [];
				// validate Cloro
				var pestCloro = forms.findWhere({ formcode: PESTANYAS.FCLORO });
				if (!_.isUndefined(pestCloro)) {
					attributes.push('chlorinereading');
				}
				// validate fugas y averias
				var pestFugas = forms.findWhere({ formcode: PESTANYAS.FFUGASYAVERIAS });
				if (!_.isUndefined(pestFugas)) {
					attributes.push('failuretypeid');
				}

				var errorsTask = this.get('task').validate();
				if (!_.isUndefined(errorsTask)) {
					return _.pick(errorsTask, attributes);
				}
				return {};
			},

			_validateFugas: function (forms) {
				var errors = {},
					fugas = forms.findWhere({ formcode: PESTANYAS.FBUSCAFUGAS });

				if(!_.isUndefined(fugas)) {
					_.extend(errors, this.get('taskHiddenLeak').validate());
				}
				return errors;
			},

			_validateDuration: function(){
				var self = this,
					err_presence = { presence: "error.duracionObligatorio"},
					err_presence_operario = { presence: "error.duracionOperario"};
				if(self.get('presence').length === 0){
					//_.extend(errors, err_presence);
					return err_presence;
				}
				var arrayPresencias = self.get('presence').models,
					fechaPresencia = '';
				for(var i=0, length=arrayPresencias.length; i < length; i++){
					fechaPresencia = moment(arrayPresencias[i].get('starttime'), 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD');
					if(_.isUndefined(self.get('operatorTask').findWhere({adddate: fechaPresencia}))){
						return { presence: { text: "error.duracionOperario", parameter: moment(fechaPresencia, 'YYYY-MM-DD').format('DD/MM/YYYY') }};
					}
				}

				return '';
			},

			_validateOperator: function(){
				var self= this,
					err_op = { operario: "error.operarioObligatorio"};
				if(self.get('operatorTask').length === 0){
					return err_op;
				}
				var arrayOperarios = self.get('operatorTask').models,
					fechaOperario = '';
				for(var i=0, length=arrayOperarios.length; i < length; i++){
					fechaOperario = arrayOperarios[i].get('adddate');

					var duracionOp = self.get('presence').filter(function (model) {
						return moment(model.get('starttime'), 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD') === fechaOperario;
					});

					if (duracionOp.length === 0) {
						return { operario: { text: "error.operarioDuracion", parameter: moment(fechaOperario, 'YYYY-MM-DD').format('DD/MM/YYYY') }};
					}
				}
				return '';
			},

			_syncData: function(operation, options){
				var attrs = {},
					self = this,
					fotos = 0,
					timeOutSec = null,
					statusTask = this.get('task').get("status");

				attrs.tm = new UUIDUtils().getUUID();
				attrs.data = _.pick(this.toJSON(), 'presence', 'task', 'operatorTask', 'meter');
				//Si la TASK es NO EJECUTADA - meter: {}
				if( statusTask === TASKSTATUS.NONEXECUTIVE){
					attrs.data = _.extend(attrs.data, {meter: []});
				}
				
				//Si la TASK es PROGRESS - afegim progressTask
				if( statusTask === TASKSTATUS.PROGRESS ){
					attrs.data = _.extend(attrs.data, _.pick(this.toJSON(), 'progressTask'));
				}

				attrs.data = JSON.stringify(attrs.data);
				attrs.op = operation;
				fotos = this.get('task').get("existatachmentfromtm");
				//definim el timeout si es SAVE o SEND
				timeOutSec = 30000;
				// intentem sincronitzar
				Backbone.sync("create", this, {
					sendData: true,
					attrs: attrs,
					timeout: timeOutSec,
					success: function(response) {
						if (response.code === "OK") {
							//Si és "SEND" mirem si s'han d'enviar fotos i borrem la task
							if(operation === SYNC.SEND){
								if((!_.isNull(fotos)) && fotos === 1){
									self._syncFotos({
										success: function(){
											self._deleteData( options );
										},
										error: function(error){
											execError(ERROR.SINCRO_ERROR);
											options.error(ERROR.SINCRO_ERROR);
										}
									});
								}else{
									self._deleteData( options );
								}
							}else if(options.success) options.success();
						}
					},
					error: function () {
						execError(ERROR.SINCRO_ERROR);
						options.error(ERROR.SINCRO_ERROR);
					}
				});
			},

			_syncFotos: function(callbacks){
				var idtask = this.get('task').get('taskid'),
					tmpPath = window.localStorage.getItem(LS_FPATH)+idtask,
					self = this;
					if(isIOS()){
						tmpPath = idtask;
					}
				//mirem si hi ha una carpeta amb fotos dins:
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
					fileSys.root.getDirectory(tmpPath,
						{create:false, exclusive: false},
						function(dirEntry) {
							// Get a directory reader
							var directoryReader = dirEntry.createReader();

							// Get a list of all the entries in the directory
							directoryReader.readEntries(function(entries) {
								self.readerSuccess(entries, dirEntry, callbacks);
							}, this._onFail);
						},
						self._onFail);
					},
					self._onFail
				);
			},

			_deleteDirectory: function(dirEntry, callbacks){
				dirEntry.removeRecursively( function(){ callbacks.success(); }, self._onFail);
			},

			readerSuccess: function(entries, dirEntry, callbacks) {
				var entriesLength = entries.length;

				if (entriesLength === 0) {
					callbacks.success();
				}

				var	self = this,
					num_success = 0,
                    prefixPath = (isIOS()) ? 'file://' : '',
					fotoLoaded = _.after(entriesLength, function(){
						if(num_success === entriesLength){
							self._deleteDirectory(dirEntry, callbacks);
						}else {
							callbacks.success();
						}
					}),
					onError = function(message){
						execError(ERROR.FILE_ERROR, JSON.stringify(message));
						fotoLoaded();
					};

				for (n=0; n < entriesLength; n++) {
                    var fotoPath = prefixPath + entries[n].fullPath,
						attrs = { namefile: entries[n].name };

					window.resolveLocalFileSystemURI(fotoPath,
						function(fileEntry) {
							fileEntry.file( function(file) {
								var reader = new FileReader();
								reader.onloadend = function(evt) {
									attrs.contentdata = evt.target.result.replace("data:image/jpeg;base64,", '');
									Backbone.sync("create", self, {
										attrs: attrs,
										url: URL_SEND_FOTO,
										type: "POST",
										sendData: true,
										success: function(response) {
											if(response.code === "OK"){
												fileEntry.remove(function() {
													num_success = num_success+1;
													fotoLoaded();
												}, function(){ fotoLoaded(); });
											}else{
												fotoLoaded();
											}
										},
										error: function(message) {
											execError(ERROR.FILE_ERROR, JSON.stringify(message));
											fotoLoaded();
										}
									});
								};
								reader.readAsDataURL(file);
							}, onError);
						},
					onError);
				}
			},

			_onFail: function(message) {
				execError(ERROR.FILE_ERROR, JSON.stringify(message));
				//ens assegurem de que la tasca es borri - success
				callbacks.success();
			}
		});
	return TaskGlobal;
});
