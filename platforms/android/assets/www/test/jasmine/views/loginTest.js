describe('View :: Login', function() {

  var mockData = { title: 'Foo Bar', timestamp: new Date().getTime(), completed: false};

  beforeEach(function() {
    var flag = false,
        that = this;

    require(['views/login'], function(LoginPage) {
      that.view = new LoginPage();
      $('#sandbox').html(that.view.render().el);
      flag = true;
    });

    waitsFor(function() {
      return flag;
    });

  });

  afterEach(function() {
    this.view.remove();
  });

  describe('Check html', function() {
   
	 it("should create a div element", function() {
		 expect(this.view.el.nodeName).toEqual("DIV");
	 });
	 
  });

  describe("login", function() {
	  
		it("contains login button", function() {
			var spyEvent = spyOnEvent('#submit_login_btn', 'click');
			$('#submit_login_btn').click();
			expect('click').toHaveBeenTriggeredOn('#submit_login_btn');
			expect(spyEvent).toHaveBeenTriggered();
		});

		it("contains signup button", function() {
			var spyEvent = spyOnEvent('#signup_btn', 'click');
			$('#signup_btn').click();
			expect('click').toHaveBeenTriggeredOn('#signup_btn');
			expect(spyEvent).toHaveBeenTriggered();
		});	  
	});  

});