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

// look for and get data file from server or from file store

, getfile = function() {
	var listing = {"initial":"value", "second":"another"};
	x$("#welcome").bottom("<p>made it before xhr callback, initial listing = " + Object.keys(listing).length);
	if (navigator.network.connection.type == Connection.NONE) {
            alert("No internet connection - cannot access remote documents");           
	} 
        else {x$('#documents').xhr('http://dev.budgetblogs.com:3000/page/pagelist.json',{
             		callback: function(){
             			x$("#welcome").bottom("<p>made it to after xhr callback ");
             			listing = eval("("+this.responseText+")");
             			x$("#welcome").bottom("<p>made it to after eval" + Object.keys(listing).length + "<p>");
             		}             		
        	});             	
        }; 
        x$("#welcome").bottom("<p>in get file, listing =  " + Object.keys(listing).length);
        return listing;
}

, getfilestore = function() {
	var s = {};
	var stuff = store.get('list', function(saved) {
				if (saved) {if (saved.value) {s=saved.value;};}
    				else {
    					s = getfile();
    					store.save({key: 'list', value: s});
    				}; 				
    	});
    	return s;
}

// display data in each section

, docheader = function(listing) {
		x$("#docheader").html("<div id='docContent'><h1>Document List for the City of Portsmouth NH</h1><p>Total Number of Documents for "
       			+ "Portsmouth NH " + " is " 
       			+ Object.keys(listing).length); 
}

, doccrumbs = function(crumbs, focus) {
		x$("#doccrumbs").html("<span id='crumbs'>");
		for (c in crumbs) {
			x$("#doccrumbs").bottom("<button>"+crumbs[c]+"</button");	
		};
		x$("#doccrumbs").bottom("</span><span id='focus'>..." + focus + "</span>");
}

, docdocs = function(docs) {
	var stuffing = "<table>";
	for (var i=0; i<docs.length; i++) {
		for (k in docs[i]) {
			stuffing += "<tr class='trow' id="
				+ k + "><td>" 
				+ k + "</td><td>"
				+ docs[i][k] + "</td></tr>";
		};
 	};
 	stuffing += "</table></div><p>";
 	x$('#docdocs').html(stuffing);
 	x$('.trow').on('click',function () {
     		var tv='<iframe width="640" height="360" src="'
     			+ this.id + '" frameborder="0" allowfullscreen></iframe>';
     		x$('#looking').html(tv);
     	});
}

, docsubs = function(subs) {  // subs is an array of subs like ["sub1", "sub2",...]
		x$("#docsubs").html("<span id='subs'>");
		for (s in subs) {
			x$("#docsubs").bottom("<button>"+subs[s]+"</button");	
		};
		x$("#docsubs").bottom("</span>");
}

, docfooter = function(list) {}

// analyze data and create data structures for display

, getcrumbs = function() {
	return ["top", "next", "cityofportsmouth.com"];
}

, getdocs = function(listing) {
	var docs = [{"key":"value"}];
	for (k in listing) {
		for (var i=0; i<listing[k].length; i++) {		
			for (key in listing[k][i]) {
				if (typeof listing[k][i][key] === 'string') {docs[i] = listing[k][i];};
			};
		};
	};
	return docs;
}

, getfocus = function(listing) {
	for (key in listing) {return key};
}

, getsubs = function(listing) {
	var subs = ["sub1", "sub2"];
	for (k in listing) {
		for (var i=0; i<listing[k].length; i++) {		
			for (key in listing[k][i]) {
				if (typeof listing[k][i][key] === 'object') {subs[i] = key;};
			};
		};
	};
	return subs;
}

, breakout = function(listing) {
	return {"crumbs": getcrumbs(),
		"focus" : getfocus(listing),
		"docs"  : getdocs(listing),
		"subs"  : getsubs(listing)
	};
}

// create display after analuzing and structuring data

, displaylist = function(listing) {
	var d = breakout(listing);
	docheader(listing);
	doccrumbs(d.crumbs, d.focus);
	docdocs(d.docs);
	docsubs(d.subs);
	docfooter(listing);
}

, listings = function() {
	var listing = getfilestore();
    	displaylist(listing);
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