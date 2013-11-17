define(['underscore', 'sqlUtils', 'moment'], function(_, sqlUtils, moment){
	var MeterDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.METER;
		this.columns = {
			meterid: { type: TYPE.INT, notNull: true, pk: true },
			meterseqid: { type: TYPE.INT },
			dial: { type: TYPE.INT },
			operation: { type: TYPE.INT, notNull: false, fk: {table: TABLEDB.METEROPERATION, columns: 'MeterOperationID'}},
			serialnumber: { type: TYPE.TEXT },
			reading: { type: TYPE.INT },
			installationdate: { type: TYPE.DATE },
			hasretentionvalve: { type: TYPE.BOOLEAN },
			rownumber: { type: TYPE.INT },
			columnnumber: { type: TYPE.INT },
			ismeterinplace: { type: TYPE.BOOLEAN },
			manufacturedyear: { type: TYPE.TEXT },
			emplacementcode: { type: TYPE.TEXT },
			gaugeid: { type: TYPE.TEXT },
			brandid: { type: TYPE.TEXT },
			modelid: { type: TYPE.TEXT },
			isremotereading: { type: TYPE.BOOLEAN },
			isinstallremotereading: { type: TYPE.BOOLEAN },
			radiomodule: { type: TYPE.TEXT },
			taskid: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASK, columns: 'taskid'}}
		};
	};

	_.extend(MeterDAO.prototype, {
		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName }, callbacks);
		},
		findByTask:function (taskid, callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " taskid=? ", whereValues: [taskid] }, callbacks);
		},
		// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		execOperation: function(tx, operation, data, taskID){
			switch(operation){
				case 'ADD':
					this.deleteRowByTask(tx, taskID); // temporal
					this.insertSyncData(tx, data, taskID);
					break;
				case 'DELETE':
					this.deleteRowByTask(tx, taskID);
					break;
				default:
					break;
			}
		},
		deleteRow: function(tx, taskID){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "taskid=?", whereValues: [taskID]});
		},
		deleteRowByTask: function(tx, taskID){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "taskid=?", whereValues: [taskID]});
		},
		insertSyncData: function (tx, meters, taskID) {
			sqlU = new sqlUtils();
			var meter_in;
			_.each(meters, function(meter){

				meter = _.extend(meter, { taskid : taskID });
				meter_in = _.pick(meter, _.keys(this.columns));
				if(!_.isNull(meter_in.meterseqid))
					meter_in.meterseqid = parseInt(meter_in.meterseqid, 10);
				if(!_.isNull(meter_in.dial))
					meter_in.dial = parseInt(meter_in.dial, 10);
				if(!_.isNull(meter_in.reading))
					meter_in.reading = parseInt(meter_in.reading, 10);
				if(!_.isNull(meter_in.rownumber))
					meter_in.rownumber = parseInt(meter_in.rownumber, 10);
				if(!_.isNull(meter_in.columnnumber))
					meter_in.columnnumber = parseInt(meter_in.columnnumber, 10);
				if(!_.isNull(meter_in.installationdate))
					meter_in.installationdate = new moment(meter_in.installationdate).format("YYYY-MM-DDTHH:mm:ss");
				if(!_.isNull(meter_in.operation))
					meter_in.operation = parseInt(meter_in.operation, 10);
				if(!_.isNull(meter_in.isremotereading))
					meter_in.isremotereading = JSON.parse(meter_in.isremotereading);
				else
					meter_in.isremotereading = false;
				if(!_.isNull(meter_in.isinstallremotereading))
					meter_in.isinstallremotereading = JSON.parse(meter_in.isinstallremotereading);

				sqlU.insertOrIgnoreRow (tx, this.tableName, meter_in);

			}, this);
		},
		saveData: function (tx, meters, taskid) {
			sqlU = new sqlUtils();
			// update dels contadors
			var self = this;
            meters.each(function(meter) {
                var data = meter.toJSON(),
                data_update = _.pick(_.omit(data, 'meterid', 'taskid'), _.keys(self.columns));
                sqlU.updateRow(tx, {tableName: self.tableName, columnsData: data_update, whereCond: " meterid=? ", whereValues: [data.meterid] });
            });
		}
	});
	return MeterDAO;
});