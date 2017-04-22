$(function () {
	//全局-输入框不要记忆
	$("input:text").attr("autocomplete", "off");
	//全局-换肤
	$("#skinBlack").click(function () {
		$(this).addClass("active").siblings(".active").removeClass("active");
		$("#skinCss").attr("href", "/css/skin-black.css");
		$.cookie("mystyle", "/css/skin-black.css", {expires: 30});
		$(".img-b").attr('src', '/images/b.png');
	});
	$("#skinWhite").click(function () {
		$(this).addClass("active").siblings(".active").removeClass("active");
		$("#skinCss").attr("href", "/css/skin-white.css");
		$.cookie("mystyle", "/css/skin-white.css", {expires: 30});
		$(".img-b").attr('src', '/images/w.png')
	});
	$("#skinCyan").click(function () {
		$(this).addClass("active").siblings(".active").removeClass("active");
		$("#skinCss").attr("href", "/css/skin-cyan.css");
		$.cookie("mystyle", "/css/skin-cyan.css", {expires: 30});
	});
	$("#skinBlue").click(function () {
		$(this).addClass("active").siblings(".active").removeClass("active");
		$("#skinCss").attr("href", "/css/skin-blue.css");
		$.cookie("mystyle", "/css/skin-blue.css", {expires: 30});
	});
	$("#skinGreen").click(function () {
		$(this).addClass("active").siblings(".active").removeClass("active");
		$("#skinCss").attr("href", "/css/skin-green.css");
		$.cookie("mystyle", "/css/skin-green.css", {expires: 30});
	});
	$("#skinRed").click(function () {
		$(this).addClass("active").siblings(".active").removeClass("active");
		$("#skinCss").attr("href", "/css/skin-red.css");
		$.cookie("mystyle", "/css/skin-red.css", {expires: 30});
	});
	//全局-换肤cookie
	var cookieStyle = $.cookie("mystyle");
	if (cookieStyle == null) {
		$("#skinCss").attr("href", "/css/skin-black.css");
	} else {
		$("#skinCss").attr("href", cookieStyle);
		if (cookieStyle == "css/skin-white.css") {
			$("#skinWhite").addClass("active").siblings(".active").removeClass("active");
		} else if (cookieStyle == "/css/skin-cyan.css") {
			$("#skinCyan").addClass("active").siblings(".active").removeClass("active");
		} else if (cookieStyle == "/css/skin-blue.css") {
			$("#skinBlue").addClass("active").siblings(".active").removeClass("active");
		} else if (cookieStyle == "/css/skin-green.css") {
			$("#skinGreen").addClass("active").siblings(".active").removeClass("active");
		} else if (cookieStyle == "/css/skin-red.css") {
			$("#skinRed").addClass("active").siblings(".active").removeClass("active");
		}
	}
	;
	//全局-左导航
	$("#aside .aside-arrow").click(function () {
		$(this).children(".glyphicon").toggleClass("glyphicon-menu-right").parents("#aside").toggleClass("aside-xs").next("#nav").toggleClass("nav-lg").next("#article").toggleClass("article-lg");
	});
	$("#aside .sidebar>li>a").click(function () {
		$(this).children(".glyphicon").toggleClass("glyphicon-minus-sign").parent("a").next("ul").slideToggle();
	});
	$("#aside .sidebar>li>ul>li>a").click(function () {
		$(this).children(".glyphicon").toggleClass("glyphicon-minus").parent("a").next("ul").slideToggle();
	});
	//全局-主导航
	$("#nav ul.nav-list>li").hover(function () {
		$(this).addClass("menu_current").children("ul").stop().fadeIn(300);
	}, function () {
		$(this).removeClass("menu_current").children("ul").stop().fadeOut(100);
	});
	//全局-响应面板加“+-”号
	$(".panel-title>a").click(function () {
		$(this).toggleClass("minus").parents(".panel").siblings(".panel").find(".minus").removeClass("minus");
	});
	//全局-模态框
	var winHeight = $(window).height();
	winHeight = winHeight - 190;
	$(".modal-body").css({"max-height": winHeight, "overflow": "auto"});
});
//全局-滚动条
(function ($) {
	$(window).load(function () {
		$("#aside").mCustomScrollbar({
			theme: "3d"
		});
		/*$("#article,#fanCon").mCustomScrollbar({
		 theme:"3d",
		 axis:"yx" ,
		 });	*/
	});
})(jQuery);
