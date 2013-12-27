
Backbone.Stickit.addHandler([{
  selector: "input[type='number']",
  events: ['keyup', 'change', 'paste', 'cut'],
  update: function($el, val) { $el.val(val); },
  getVal: function($el) { return $el.val(); }
},
{
  selector: "span.lbl-value",
  events: ['keyup', 'change', 'paste', 'cut'],
  onGet: function (val) {
	return (_.isNull(val) || _.isUndefined(val) || _.isEmpty(val)) ? "-" : val;
  }
}]);