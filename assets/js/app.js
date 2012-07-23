// 
//  --- our app behavior logic ---
//
run(function () {

    
    // immediately invoked on first run
    var init = (function () {
 //  	$(':jqmData(url^="home")').live('pagebeforecreate', function(event) {
//    		$(this).filter(':jqmData(url*=ui-page)').find(':jqmData(role=header)')
//    			.prepend('<a href="#home" data-icon="home" data-iconpos="right">Home</a>')
//      			.prepend('<a href="#" data-rel="back" data-icon="back">Back</a>')
//      			.attr('data-position','fixed')
//  	});
 // 	$.mobile.loading( 'show', { theme: "b", text: "Loading Data Files" });
    	listings();
        fulllist();
        store.get('city', function(saved) {
    		if (saved) {if (saved.value) {x$('#city_input').attr('placeholder', saved.value);};}    		
    	});
    	x$("#city_input").on("keyup", function() {
    		getcitylist(this.value);	
    	});
    })();
});
