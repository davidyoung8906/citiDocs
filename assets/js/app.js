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
    	
//    	$("#logs").append("init");
		
//		$("#city_search").on("keyup", function() {
//    					getcitylist(this.value);	
//    				});
	$("citylist").fadeTo('fast',0);
    	listings();
        fulllist();
        $("#city_search").focus();
        store.get('city', function(saved) {
    		if (saved) {if (saved.value) {$('input#city_input').attr('placeholder', saved.value);};}    		
    	});
    	
    })();
});
