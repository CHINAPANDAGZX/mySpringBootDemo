(function($) {
	if (!$) return;
	
	$('img .wapp-icon').error(function(e){
		var ele = e.target;
		var loadTime = $(ele).attr("loadTime");
		if (!loadTime) {
			ele.src = CTX+'static/images/biaodanmoban.png';
			$(ele).attr("loadTime", "1");
		}
	})
})(window.jQuery);