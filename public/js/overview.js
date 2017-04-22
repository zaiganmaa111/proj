$(function(){
	$(".tab-container>li").click(function(){
		$(this).addClass("active");
		var num=$(this).index();
		$(this).siblings(".toggle-list").removeClass("active");
		$(".bottom-container>.osc-list").eq(num).addClass("active");
		$(".bottom-container>.osc-list").eq(num).siblings(".osc-list").removeClass("active");
	});
})
