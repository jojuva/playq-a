define(['underscore', 'sqlUtils', 'moment'], function(_, sqlUtils, moment){
	var QueueGlobalDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.QUEUE;
		this.columns = {
			id: { type: TYPE.INT, notNull: true, pk: true },
			op: { type: TYPE.TEXT },
			entity: { type: TYPE.TEXT },
			data: { type: TYPE.TEXT }
		};
	};

	_.extend(QueueGlobalDAO.prototype, {

		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
		},
		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName}, callbacks);
		},
		findAllOrderById:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, orderBy: ["id ASC"] }, callbacks);
		}
		});
	return QueueGlobalDAO;
});