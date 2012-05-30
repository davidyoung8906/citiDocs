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
    			if (saved.value) {x$('input#city_input').attr('placeholder', saved.value);}    		
    		});        
    })();
    
    // a little inline controller
    when('#welcome', function() {});
    when('#documents', function() {});
    when('#pages', function() {
        x$('content').xhr('inner', 'http://www.google.com/#hl=en&gs_nf=1&cp=6&gs_id=n&xhr=t&q=phonegap&pf=p&sclient=tablet-gws&tbo=d&site=&source=hp&oq=phoneg&aq=0&aqi=g3&aql=&gs_l=&pbx=1&bav=on.2,or.r_gc.r_pw.,cf.osb&fp=66966f4d70652205&biw=1024&bih=660');
    });
    when('#people', function() {});
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
