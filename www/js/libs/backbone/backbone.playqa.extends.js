(function($) {
	_.extend(Backbone.View.prototype, {

		close: function () {
			if (this.beforeClose) {
				this.beforeClose();
			}
			if (!_.isUndefined(this.subviews)) {
				_.each(this.subviews, function(subview) {
					subview.close();
				});
				_(this.subviews).removeAll();
			}
			this.remove(); //--> 'remove' is not necessary because the method is called on 'pagehide' jquerymobile event.
			this.unbind();
		},

		// Patch for removeEvents support
		remove: function() {
			//var remove = Backbone.View.prototype.remove;

			if (this.undelegateEvents) {
				// Invoke Backbone to remove them
				this.undelegateEvents();
			}
				this.stopListening();
			// Pass through to default implementation
			//return remove.apply(this, arguments);
			return this;
		},

		printRequiredLabels: function () {
			var $requiredLabels = this.$el.find("[data-required='true']");
			_.each ($requiredLabels, function (element) {
				$(element).append("<span class='required-label ui-icon ui-icon-asterisk'></span>");
			});
		},

		showErrors: function (errors) {
			this.hideErrors();
			_.each(errors, function (value, key) {
				var $element = this.$el.find("[data-validate-field='" + key + "']");
				if ($element.is("input")) {
					$element.closest("div.ui-input-text").addClass('input-error');
				}
				else if ($element.is("textarea")) {
					$element.addClass('input-error');
				}
				else if ($element.is("select")) {
					$element.closest('div.ui-btn').addClass('input-error');
				}
				else if ($element.is("label")) {
					$element.addClass("error-label");
				}
				$('#error-message-' + key, this.el).show();
			}, this);
			$.mobile.loading('hide');
		},

		showErrorMessage: function ($errors, errors) {

			require(['text!templates/errorItem.html'], function(errorItemTpl){

				if (!_.isEmpty(errors)) {
					var listVal = _.values(errors),
						tpl = '',
						text = '';

					_.each(listVal, function(val) {
						var dataTpl;
						if(!_.isObject(val)) {
							text = $.t(val);
						} else if (val.i18n === false) {
							text = val.text;
						} else if (val.parameter) {
							text = $.t(val.text) + val.parameter;
						} else {
							text = $.t(val.text);
						}

						dataTpl = { errorText: text };
						tpl += _.template(errorItemTpl, dataTpl);
					});
					$errors.html(tpl).show();
				}
				else {
					$errors.hide();
				}
			});
		},

		hideErrorMessage: function($errors) {
			$errors.hide();
		},

		hideErrors: function () {
			$(".input-error", this.el).removeClass('input-error');
			$(".error_message", this.el).hide();
			$("label.error-label", this.el).removeClass('error-label');
		}
	});
})(jQuery);


_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);