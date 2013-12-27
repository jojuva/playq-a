var defaultBackboneSync = Backbone.sync;


Backbone.sync = function (method, model, options) {
    _checkSession({ success: function() {

        if ((!_.isUndefined(model) && model.syncro === true) || (options.sendData === true)) {

            if(_.isUndefined(options.type)){
                options.type = (model.syncro === true) ? "GET" : "POST";
            }

            if(_.isUndefined(options.timeout)){
                options.timeout = (options.type === "GET") ? GET_TIMEOUT : POST_TIMEOUT;
            }

            if (!_.isUndefined(model) && model.local === true) {
                // TODO temporal borrar al entregar
                options.url = model.url;
            } else {
                if(_.isNull(options.url) || _.isUndefined(options.url)) {
                    options.url = window.localStorage.getItem(LS_URL_WS) + model.url;
                }
                else {
                    options.url = window.localStorage.getItem(LS_URL_WS) + options.url;
                }
            }

            options = _.omit(options, 'sendData', 'syncro');
            _.extend(options, {
                cache: false,
                dataType: "json",
                beforeSend: function (xhr){
                    xhr.setRequestHeader('Authorization', make_base_auth());
                }
            });

            defaultBackboneSync(method, model, options);
        }
        else {
            Backbone.webSQLSync(method, model, options);
        }
    }});
};

Backbone.webSQLSync = function (method, model, options) {

	var dao = new model.dao(window.db);

    switch (method) {
        case "read":
            if (model.id)
                dao.find(model, {
                    success: function (data) {
                        if (data === undefined)
                            options.error();
                        else
                            options.success(data);
                    },
                    error: options.error
                });
            else {
                dao.findAll({
                    success: function (data) {
                        options.success(data);
                    },
                    error: options.error
                });
            }

            break;
        case "create":
            dao.create(model, function (data) {
                if (data === undefined)
                    options.error();
                else
                    options.success(data);
            });

            break;
        case "update":
            dao.update(model, function (data) {
                if (data === undefined)
                    options.error();
                else
                    options.success(data);
            });
            break;
        case "delete":
            dao.destroy(model, {
                success: function (data) {
                    options.success(data);
                },
                error: options.error
            });
            break;
        default:
            break;
    }
};

function _checkSession(callbacks) {
    require(["loginUtils"], function(LoginUtils) {
        if (!new LoginUtils().sessionExpired() && callbacks.success) {
            callbacks.success();
        }
    });
}