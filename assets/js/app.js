// 
//  --- our app behavior logic ---
//
run(function () {

    
    // immediately invoked on first run
    var init = (function () {
        if (navigator.network.connection.type == Connection.NONE) {
            alert("No internet connection - cannot access remote documents");
        } else {
       	     x$('#documents').xhr('http://dev.budgetblogs.com:3000/page/pagelist.json',{
                callback: function(){
                     
                     var list = eval("("+this.responseText+")"); /* this should be an array or hash */
                     var stuffing = "<div id='docContent'><h1>City Documents</h1><p>Total Number of Documents for "
                     			+ "Portsmouth NH" + " is " 
                     			+ list.length + " <table> ";
   		     for (var i=0; i<list.length; i++){
  			var row = list[i];
  			
  			stuffing += "<tr class='trow' id="
  					+ eval(i + 1) + "'><td>" 
  					+ eval(i + 1) + "</td><td>"
  					+ row.key + "</td><td>"
  					+ row.value + "</td></tr>"; 
 		     };
  		     stuffing += "</table></div><p>";
    		     x$('#documents').inner(stuffing);
   // 		     var el=x$('.row_button');
    		     x$('.trow').on('click',function () {
    		     	var i = -1 + parseInt(this.id) ;
    		     	var tv='<iframe width="640" height="360" src="http://www.'
    		     		+ cities[i][0] + cities[i][1]
    		     		+ '" frameborder="0" allowfullscreen></iframe>';
    		     	x$('#looking').html(tv);
    		     });        		     
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
    
});
