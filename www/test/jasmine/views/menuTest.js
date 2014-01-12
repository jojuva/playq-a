describe('View :: Menu', function() {

  var mockData = { title: 'Foo Bar', timestamp: new Date().getTime(), completed: false};

  beforeEach(function() {
    var flag = false,
        that = this;

    require(['views/menuPage'], function(MenuPage) {
      that.view = new MenuPage();
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

  describe("menu", function() {
	  
		it("contains login button", function() {
			var spyEvent = spyOnEvent('#submit_login_btn', 'click');
			$('#submit_login_btn').click();
			expect('click').toHaveBeenTriggeredOn('#submit_login_btn');
			expect(spyEvent).toHaveBeenTriggered();
		});

	});  

});