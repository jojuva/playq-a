
/*** underscorejs extended methods ***/

(function() {
_.mixin({
	// remove a object key
	remove: function(obj, key){
        delete obj[key];
        return obj;
    },
    // remove all object keys
    removeAll: function(obj){
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				delete obj[prop];
			}
		}
		return obj;
    }
});

})();