// the app method accepts a fn to invoke on init unobtrusively 
var run = function(application) {
    if (navigator.userAgent.indexOf('Browzr') > -1) {
        // blackberry
        setTimeout(application, 250)	
    } else {
        // attach to deviceready event, which is fired when phonegap is all good to go.
        x$(document).on('deviceready', application, false);
    }
}

// throw our settings into a lawnchair
, store = new Lawnchair({adaptor:'dom'})

, getfile = function() {
	var listing = {};
	
}

, displayit = function(listing) {
	
}

, listings = function() {
	var listing = {};
	store.get('listing', function(saved) {
    		if (saved) {if (saved.value) {
    				listing = saved.value;};}
    		else {listing = getfile;}
    	});
    	displayit;
	if (navigator.network.connection.type == Connection.NONE) {
            alert("No internet connection - cannot access remote documents");
        } else {
       	     x$('#documents').xhr('http://dev.budgetblogs.com:3000/page/pagelist.json',{
             	callback: function(){
                     
                listing = eval("("+this.responseText+")"); /* this should be an array or hash */
 //                   var listing = eval(this.responseText);
                var stuffing = "<div id='docContent'><h1>City Documents</h1><p>Total Number of Documents for "
                   			+ "Portsmouth NH " + " is " 
                    			+ Object.keys(listing).length + " <table> ";
                var i=0;
 		for (var k in listing) {
 			stuffing += "<tr class='trow' id="
  				+ k + "><td>" 
 // 				+ eval(i+1) + "</td><td>"
  				+ k + "</td><td>"
  				+ listing[k] + "</td></tr>"; 
  			i++;			
 		     };
  		     stuffing += "</table></div><p>";
    		     x$('#documents').inner(stuffing);
   // 		     var el=x$('.row_button');
    		     x$('.trow').on('click',function () {
    //		     	var i = -1 + parseInt(this.id) ;
    		     	var tv='<iframe width="640" height="360" src="'
    		     		+ this.id + '" frameborder="0" allowfullscreen></iframe>';
    		     	x$('#looking').html(tv);
    		     });        		     
                  }
             });
        };
}

// shows id passed
, display = function(id) {
    x$(["#welcome", "#map", "#documents", "#pages", "#people", "#looking"]).each(function(e, i) {
        var display = '#' + x$(e)[0].id === id ? 'block' : 'none';
        x$(e).css({ 'display':display })
    });
}

// reg a click to [id]_button, displays id (if it exists) and executes callback (if it exists)
, when = function(id, callback) {
    x$(id + '_button').on('touchstart', function () {
        if (x$(id).length > 0)
            display(id);
        if (callback)
            callback.call(this);
		return false;
    });
}

// gets the value of the setting from the ui
, ui = function(setting) {
    var radio = x$('#settings_form')[0][setting];
    for (var i = 0, l = radio.length; i < l; i++) {
        if (radio[i].checked)
            return radio[i].value;
    }
}

// gets the value of the city input field from the ui
//, city_ui = function() {
//    return "city: " + x$('input#city_form').attr('city');
//}

//, citySave = function() {
//    store.save(city:'xxxxxx');
//    x$('input#city_input').after('citySave: ');
//};