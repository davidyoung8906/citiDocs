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
	var listing = {"initial":"value", "second":"another"};
//	x$("#welcome").bottom("<p>made it before xhr callback, initial listing = " + Object.keys(listing).length);
//	if (navigator.network.connection.type == Connection.NONE) {
//            alert("No internet connection - cannot access remote documents");           
//	} 
//        else {x$('#documents').xhr('http://dev.budgetblogs.com:3000/page/pagelist.json',{
//             		callback: function(){
//             			x$("#welcome").bottom("<p>made it to after xhr callback ");
//             			listing = eval("("+this.responseText+")");
//             			x$("#welcome").bottom("<p>made it to after eval" + Object.keys(listing).length + "<p>");
//             		}             		
//        	});             	
//        }; 
//        x$("#welcome").bottom("<p>in get file, listing =  " + Object.keys(listing).length);
        return listing;
}

, getfilestore = function() {
	var s = getfile();
//	var stuff = store.get('list', function(saved) {
//				if (saved) {if (saved.value) {s=saved.value;};}
//    				else {
//    					s = getfile();
//    					store.save({key: 'list', value: s});
//    				}; 				
//    	});
    	return s;
}

//, displaylist = function(listing) {
//	var stuffing = "<div id='docContent'><h1>City Documents</h1><p>Total Number of Documents for "
//       			+ "Portsmouth NH " + " is " 
//       			+ Object.keys(listing).length + " <table> ";
//	for (var k in listing) {
//		stuffing += "<tr class='trow' id="
//				+ k + "><td>" 
//				+ k + "</td><td>"
//				+ listing[k] + "</td></tr>"; 			
 //	};
// 	stuffing += "</table></div><p>";
// 	x$('#documents').inner(stuffing);
 //	x$('.trow').on('click',function () {
   //  		var tv='<iframe width="640" height="360" src="'
     //			+ this.id + '" frameborder="0" allowfullscreen></iframe>';
     //		x$('#looking').html(tv);
     //	});
//}

, listings = function() {
	var listing = getfilestore();
//    	displaylist(listing);
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