$(function(){
	function centerModals(){
		$('.modal').each(function(i){
		    var $clone = $(this).clone().css('display', 'block').appendTo('body');//clone() 方法生成被选元素的副本，包含子节点、文本和属性。
		    var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
		    top = top > 50 ? top : 0;
		    $clone.remove();
		    $(this).find('.modal-content').css("margin-top", top-50);
	 	});
	}
	// 在模态框出现的时候调用垂直居中函数
	$('.modal').on('show.bs.modal', centerModals);
	//show.bs.modal 在show方法调用时立即触发
	//shown.bs.modal在模态框完全显示出来，并且等css动画完成之后触发
	//hide.bs.modal在hide方法调用时还未隐藏关闭时触发
	//hiden.bs.modal在模态框完全隐藏之后并且等CSS动画完成之后出发
	// 在窗口大小改变的时候调用垂直居中函数
	/*$(window).on('resize', centerModals);*/
	
});
