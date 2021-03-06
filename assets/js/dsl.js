//  CityDocs Mobile App Function List
//  Copyright Jack Thorsen 2-11-2012

// the app method accepts a fn to invoke on init unobtrusively 
var run = function(application) {
    if (navigator.userAgent.indexOf('Browzr') > -1) {
        // blackberry
        setTimeout(application, 250);	
    } else {
        // attach to deviceready event, which is fired when phonegap is all good to go.
        x$(document).on('deviceready', application, false);
    };
}

// throw our settings into a lawnchair
, store = new Lawnchair({adaptor:'dom'})

// look for and get data file from server or from file store

, getcitylist = function(part) {
	var listing = [];
//	$("#logs").append("start getcitylist");

	if (navigator.network.connection.type == Connection.NONE) {
            alert("No internet connection - cannot access remote documents");           
	} else {
//		$("#citylist").fadeTo('slow',0.5);
		$.get('http://dev.budgetblogs.com:3000/page/pagelist.json',{chars:part}, function(data) {
//				$("#logs").append("here's the raw data :" + data);
				citylist(data);
		});
	};
}

, citylist = function(cities) {
	var html="";
	if (cities.length == 0) {
//		$("#logs").append("<li>city list is empty</li>");
		$("#citylist").stop().fadeTo(400,0);
	}
	else {
		html="<li data-role='list-divider'>City choices</li>";
		for (i=0; i<cities.length; i++) {
			html+="<li>" + cities[i] + "</li>";
		};
		$("#citylist").html(html);
		$("#citylist").listview("refresh").stop().fadeTo(400,1);
//		$("#logs").append("<li>city list has: " + cities + "</li>");
	};
	
}

, getfile = function() {
//	$("#logs").append("<li>Beginning of getfile</li>");
	var listing = {"test":"data"};
	if (navigator.network.connection.type == Connection.NONE) {
            alert("No internet connection - cannot access remote documents"); 
            return true;          
	} 
	else {x$('#home').xhr('http://dev.budgetblogs.com:3000/page/pagelist.json',{
		callback: function(){
             			listing = eval("("+this.responseText+")");
             			store.save({key: 'response', value: this.responseText});
//             			$("#logs").append("<li>Inside json callback</li>");
             		}             		
        	});             	
        }; 
        
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
//    	$("#logs").append("<li>End of getfilestore</li>");
    	return s;
}

// display data in each section

, docheader = function(listing) { 
}

, fulllist = function() {  //Deprecated
//	$("#fulllist").append("<li>Made it here</li>");
//	$("#fulllist").listview("refresh");
//	$.mobile.loading( 'show', { theme: "b", text: "Making Lists"});
//	$("#fulllist").html(makelist());
//	$("#fulllist").listview("refresh");
//	$(".ui-header").css({"position":"fixed","width":"100%","z-index":"9999"})
//	ulinput();
//	$("#fulllist").listview("refresh");
//	$.mobile.loading( 'hide');
}

, makelist = function() {
	var s={};
//	$("#fulllist").append("<li>Start of makelist</li>");
	store.get('response', function(saved) {
		s=saved.value;
	});
//	$("#fulllist").append("<li>got response</li>");
	var li='<li data-theme="e" >'
		+ '<a href="$1">$2</a>';
	return s
		.replace(/{/g,'<li>')
		.replace(/}/g,'</li>')
		.replace(/\]/g,'</ul>')
		.replace(/<li>"((?:.(?!"))*.)":(?!\[)"((?:.(?!"))*.)"/g, li)
		.replace(/:\[/g,'<ul data-role="listview" data-inset="true">')
		.replace(/(?:[\"\,])/g,'')
		.replace(/http:\/\//, 'Top Document Folder');
//	$("#fulllist").append("<li>end of makelist</li>");
}

, ulinput = function() {
	$(".ui-header").each(function() { 
		$(this).prepend('<a data-rel="back" data-icon="arrow-l">BACK</a>');
	});
}

// Create list of Document Location Crumbs for display as buttons
, doccrumbs = function() {
//		$("#crumblist").html("<li data-role='list-divider' data-theme='e'>");
		var crumbs = getcrumbs();
		var crumbbutton = "";
		for (var i=0; i<crumbs.length; i++) {
			crumbbutton += "<button onclick='popcrumbs(" 
					+ (crumbs.length - i - 1) + ")'>"
					+ crumbs[i] + "</button>  ";
		};
		$("#crumblist").html("<li data-role='list-divider' data-theme='b'>" 
                                        + crumbbutton + "</li>");	
//		$("#crumblist").listview();
}

// Go up crumb list
, popcrumbs = function(n) {
	var crumbs = getcrumbs();
	while(n > 0) {
		crumbs.pop();
		n--;		
	};
	store.save({key: "crumbs", crumbstore: crumbs});
	
	resolve();
}

// Add to crumb list
, pushcrumb = function(crumb) {
	var crumbs = getcrumbs();
	crumbs[crumbs.length] = crumb;
	store.save({key: "crumbs", crumbstore: crumbs});
}

// Create and display list of documents at current node
, docdocs = function(docs) {
	var docpath = getpath();
	var stuffing = "<table>";
	for (var i=0; i<docs.length; i++) {
		for (k in docs[i]) {
			stuffing += "<tr class='trow' id='"+ k 
                                         + "'><td class='docurl' onclick='window.open(" 
                                         + '"' + docpath + k + '"' + ")'>" + k 
                                         + "</td><td class='doctitle' onclick='window.open(" 
                                         + '"' + docpath + k + '"' + ")'>" + docs[i][k] 
                                         + "</td></tr>";	
		};
 	};
 	stuffing += "</table></div><p>";
 	x$('#docdocs').html(stuffing);
}

// Create and display sub-folders of current node
, docsubs = function(subs) {  // subs is an array of subs like ["sub1", "sub2",...]
		$("#subslist").html("<li data-role='list-divider' data-theme='b'>Search Folders</li>");
		for (var i=0; i<subs.length; i++) {
			var subbutton = "<li id='subbutton" + i + "' data-icon='forward' data-theme='c'>"
					+ subs[i] + "</li>";
			$("#subslist").append(subbutton);
		};
		for (var i=0; i<subs.length; i++) {
			var ref = "#subbutton" + i;
			var newfocus = subs[i];
			$(ref).on('click', eval("(function() {resolvedown('" + newfocus + "')})")); 
		};
		$('#subslist').listview('refresh');
}

, resolvedown = function(newfocus) {
	pushcrumb(newfocus);
	resolve();
}

, resolve = function() {
	var crumbs = getcrumbs();
	var list = [getfilestore()];
	var focus = "http://";
	for (i=1; i<crumbs.length; i++) {
		for (j=0; j<list.length; j++) {
			h = list[j];
			for (k in h) {
				if (k == crumbs[i]) {
					focus = k;
					list = h[k];
				};
			};
		};
	};
	displaylist({focus:list});	
}

// Not used
, docfooter = function(list) {}

// Analyze data and create data structures for display

, getpath = function() {
	var crumbs = getcrumbs();
	var path = crumbs[1];
	for (i=2; i<crumbs.length; i++) {
		path += crumbs[i] + "/";
	};
	return path;
}

, getcrumbs = function() {	
	var crumblist = ['nothing'];
	store.get('crumbs', function(saved) {
		if (saved) {if (saved.crumbstore) {crumblist=saved.crumbstore;};}
    		else {
    			var focus = "";
			for (k in getfilestore()) {focus = k};
    			crumblist = ["TOP", focus];
    			store.save({key: 'crumbs', crumbstore: crumblist});
    			
    		}; 				
    	});
    	return crumblist;
}

, getdocs = function(listing) {
	var docs = [];
	for (k in listing) {
		for (var i=0; i<listing[k].length; i++) {		
			for (key in listing[k][i]) {
				if (typeof listing[k][i][key] === 'string') {docs[docs.length] = listing[k][i];};
			};
		};
	};
	return docs; // an array of associations [{file:title},...]
}

, getsubs = function(listing) {
	var subs = [];
	for (k in listing) {
		for (var i=0; i<listing[k].length; i++) {		
			for (key in listing[k][i]) {
				if (typeof listing[k][i][key] !== 'string') {subs[subs.length] = key;};
			};
		};
	};
	return subs; // and array of keys [subgroup, ...] 
}

// create display after analuzing and structuring data

, displaylist = function(listing) {
	docheader(listing);
	doccrumbs();
	docdocs(getdocs(listing));
	docsubs(getsubs(listing));
	docfooter(listing);
//   	$("#crumblist").listview("refresh");
//   	$("#subslist").listview("refresh");
}

, listings = function() {
//	$("#logs").append("<li>Made it before getfilestore</li>");
	var listing = getfilestore();
//	$("#logs").append("<li>Finished Filestore retrieve<li>");
//	var crumbs = getcrumbs();
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

// Auto-complete turned off:
// gets the value of the city input field from the ui
//, city_ui = function() {
//    return "city: " + x$('input#city_form').attr('city');
//}

//, citySave = function() {
//    store.save(city:'xxxxxx');
//    x$('input#city_input').after('citySave: ');
//};