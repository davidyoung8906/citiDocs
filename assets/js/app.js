// 
//  --- our app behavior logic ---
//
run(function () {
    // immediately invoked on first run
    var init = (function () {
        if (navigator.network.connection.type == Connection.NONE) {
            alert("No internet connection - cannot access remote documents");
        } else {
            
        };
        
        	store.get('city', function(saved) {
    			if (saved) {
    				if (saved.value) {
    					x$('#title_bar').after('Got something: '+saved.value);
    					x$('input#city_input').attr('placeholder', saved.value);
    				} else {
    					x$('#title_bar').after('Got nothing');
    				}
    			}
    		
    		});
        
    })();
    
    // a little inline controller
    when('#welcome', function() {
//                x$('#welcome').after('Contents of store ' + store.each(function(record, index){
//                        '<li>' + index + ' ' + record});
		var stuff = "Give it a go" + (store.get('city', function(saved) {return saved.value;})||'Nothing there');
                x$('#title_bar').after(stuff);
    		
	});	
    when('#settings', function() {
		// load settings from store and make sure we persist radio buttons.
		store.get('config', function(saved) {
			if (saved) {
				if (saved.map) {
					x$('input[value=' + saved.map + ']').attr('checked',true);
				}
				if (saved.zoom) {
					x$('input[name=zoom][value="' + saved.zoom + '"]').attr('checked',true);
				}
			}
		});
	});
    when('#map', function () {
        store.get('config', function (saved) {
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
        display('#welcome');
    });
});
