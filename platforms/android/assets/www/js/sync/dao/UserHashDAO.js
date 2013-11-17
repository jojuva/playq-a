define(['underscore', 'sqlUtils', 'moment'], function(_, sqlUtils, moment){
    var UserHashDAO = function (db) {
        this.db = db;
        this.tableName = TABLEDB.USER_HASH;
        this.columns = {
            idUserHash: { type: TYPE.INT, notNull: true, pk: true },
            hash: { type: TYPE.TEXT },
            data: { type: TYPE.DATE }
        };
    };

    _.extend(UserHashDAO.prototype, {

        // Populate user hash table with sample data
        populate:function (tx) {
            sqlU = new sqlUtils();
            sqlU.createTable (tx, this.tableName, this.columns);
            var data = moment().format("YYYY-MM-DD");
            sqlU.insertOrIgnoreRow (tx, this.tableName, {idUserHash: 1, hash: null, data: data});
        },

        // custom methods
        getHash: function (callbacks) {
            var self = this;
            new sqlUtils().globalFind({ db: this.db, tableName: this.tableName, columns: ['hash'] }, callbacks);
        },

        setHash: function (newHash, callbacks) {
            var self = this;
            this.db.transaction(
                function (tx) {
                    new sqlUtils().updateRow(tx, {tableName: self.tableName, columnsData: { hash: newHash, data: moment().format("YYYY-MM-DD") } });
                },
                function (error) {
                    if (callbacks.error) callbacks.error();
                },
                function () {
                    if (callbacks.success) callbacks.success(newHash);
                }
            );
        }
    });
    return UserHashDAO;
});