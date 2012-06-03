// 
//  --- our app behavior logic ---
//
run(function () {

    
    // immediately invoked on first run
    var init = (function () {
        if (navigator.network.connection.type == Connection.NONE) {
            alert("No internet connection - cannot access remote documents");
        } else {
       	     x$('#documents').xhr('http://dev.budgetblogs.com:3000/city_docs.json',{
                callback: function(){
                     
                     var cities = eval("("+this.responseText+")"); /* this should be an array */
                     var stuffing = "<div id='docContent'><h1>City Documents</h1><p>Total Number of Cities: " + cities.length + " <table> ";
   		     for (var i=0; i<cities.length; i++){
  			var row = cities[i];
  			stuffing += "<tr><td>" 
  					+ row.id + "</td><td>" 
  					+ row.doctype + "</td><td>"
  					+ row.title + "</td><td>"
  					+ row.description + "</td><td>"
  					+ "<button class='row_button' id='" 
  					+ row.id + "'>Open</button></td></tr>"; 
 		     };
  		     stuffing += "</table></div><p>";
    		     x$('#documents').inner(stuffing);
    		     var el=x$('.row_button');
    		     x$('#looking').inner(el);
 //   		     for (i=0; el.length; i++) {
//    		     	var e=el[i];
  //  		     	e.on('firsttouch', function () {
    //		     		var ls="http://dev.budgetblogs.com:3000/city_docs/" + e.id;
    //		     		x$('#looking').xhr(ls);
    //		     		display('#looking');
    //		     	});
   //		     };    		     
                }
             });
        };
        store.get('city', function(saved) {
    		if (saved) {if (saved.value) {x$('input#city_input').attr('placeholder', saved.value);};}    		
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
    when('#look', function () {
    	locate="http://dev.budgetblogs.com:3000/city_docs/";
    	x$("#looking").xhr(locate);
    	display('#looking');
    });
});
