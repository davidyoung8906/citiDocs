// 
//  --- our app behavior logic ---
//
run(function () {

    
    // immediately invoked on first run
    var init = (function () {
    	$(':jqmData(url^="home")').live('pagebeforecreate', function(event) {
    		$(this).filter(':jqmData(url*=ui-page)').find(':jqmData(role=header)')
      			.prepend('<a href="#" data-rel="back" data-icon="back">Back</a>')
  	});
    	listings();
        fulllist();
        store.get('city', function(saved) {
    		if (saved) {if (saved.value) {x$('input#city_input').attr('placeholder', saved.value);};}    		
    	});
    	x$("#city_input").on("keyup", function() {
    		getcitylist(this.value);	
    	});
    })();
    
    // a little inline controller
    when('#welcome', function() {});
    when('#documents', function() {});
    when('#pages', function() {});
    when('#people', function() {});
    when('#looking', function() {});
    when('#map', function () {
        store.get('config', function (saved) {
        	if (saved) {
			if (saved.map) {
				x$('input[value=' + saved.map + ']').attr('checked',true);
			}
			if (saved.zoom) {
				x$('input[name=zoom][value="' + saved.zoom + '"]').attr('checked',true);
			}
		};
            // construct a gmap str
            var map  = saved ? saved.map || ui('map') : ui('map')
            ,   zoom = saved ? saved.zoom || ui('zoom') : ui('zoom')
            ,   path = "http://maps.google.com/maps/api/staticmap?center=";
			
            navigator.geolocation.getCurrentPosition(function (position) {
                var location = "" + position.coords.latitude + "," + position.coords.longitude;
                path += location + "&zoom=" + zoom;
                path += "&size=250x250&maptype=" + map + "&markers=color:red|label:P|";
                path += location + "&sensor=false";

                x$('img#static_map').attr('src', path);
            }, function () {
                x$('img#static_map').attr('src', "assets/img/gpsfailed.png");
            });
        });
    });
    when('#save', function () {
        store.save({
            key:'config',
            map:ui('map'),
            zoom:ui('zoom')
        });
        display('#map');
    });
    
});
