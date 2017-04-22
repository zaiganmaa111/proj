$(function(){
	/*添加方案*/
	$(".AddBtn").click(function(){
		$(".tabContainer>.nav-tabs").find("li.active").removeClass("active");
		$(".tabContainer>.tab-content").find("div.active").removeClass("in").removeClass("active");
		var num=$(".tabContainer>.nav-tabs>li").length+1;
		
		var addLi='<li role="presentation" class="active"> <a href="#tabCon'+num+'" id="tab'+num+'" role="tab" data-toggle="tab" aria-controls="tabCon2" aria-expanded="true"><input type="text" value="方案'+num+'" class="input-edit" disabled onblur="blurInput(this)"/></a></li>'
		var ulInput=$(".tabContainer>.nav-tabs");
		$(ulInput).append(addLi);
		/*添加 下面的菜单*/
		var addDiv='<div role="tabpanel" class="tab-pane fade in active mCustomScrollbar" data-mcs-theme="3d" id="tabCon'+num+'" aria-labelledby="tab'+num+'" style=""><ul class="deploy-table"><li >系统总览</li><li class="deploy-list"><span class="glyphicon glyphicon-triangle-bottom"></span>参数总览</li><li class="deploy-list"><div class="pull-right  right-btn"><button type="button" class="btn btn-success  btn-sm addBtnLi" onclick="addLi(this)">添加</button><button type="button" class="btn btn-primary btn-sm">应用</button></div></li></ul></div>'
		$(".tabContainer>.tab-content").append(addDiv);
	});
	/*编辑方案*/
	$(".EditBtn").click(function(){
		var editInput=$(".tabContainer>.nav-tabs").find("li.active").find(".input-edit");
		$(editInput).removeAttr("disabled");
		$(editInput).focus();
		/*$(editInput).blur(function(){
			$(editInput).attr("disabled",true);
			var txt=$(editInput).val();			
			$(editInput).attr("value",txt);
			$(editInput).blur();
		});*/
	});
});
/*失去焦点*/
function blurInput(editInput){
	$(editInput).attr("disabled",true);
	var txt=$(editInput).val();			
	$(editInput).attr("value",txt);
	
}

/*删除方案*/
$(".DeleteBtn").click(function(){	
	var deleteLi=$(".tabContainer>.nav-tabs").find("li.active");
	var txt=$(deleteLi).children("a").attr("href");
	$(deleteLi).remove();
	$(txt).remove();
	$(".tabContainer>.nav-tabs").children(":first").addClass("active");
	$(".tabContainer>.tab-content").children(":first").addClass("in").addClass("active");	
	
});


/*编辑Li*/
function editLi(editBtn){
	var editInput=$(editBtn).closest(".deploy-list-none").find(".editLi");
	$(editInput).removeAttr("disabled");
	$(editInput).focus();
	$(editInput).blur(function(){
		$(editInput).attr("disabled",true);
		var txt=$(editInput).val();			
		$(editInput).attr("value",txt);
		
	});
}
/*$(".editBtn").click(function(){
	var editInput=$(this).closest(".deploy-list-none").find(".editLi");
	$(editInput).removeAttr("disabled");
	$(editInput).focus();
	$(editInput).blur(function(){
		$(editInput).attr("disabled",true);
		var txt=$(editInput).val();			
		$(editInput).attr("value",txt);
		$(editInput).blur();
	});
});*/

/*添加LI*/
function addLi(addBtn){	
	var addLi='<li class="deploy-list-none"><div class="pull-left">	<span class="glyphicon glyphicon-triangle-bottom"></span><input type="text" value="01--添加的名字" disabled class="editLi"/></div><div class="pull-right  right-btn"><button type="button" class="btn btn-warning  btn-sm editBtn" onclick="editLi(this)">编辑</button><button type="button" class="btn btn-danger btn-sm deleteBtn" onclick="deleteLi(this)">删除</button></div></li>';
	var insertLi=$(addBtn).closest(".deploy-list");
	$(insertLi).before(addLi) ;
}
/*删除LI*/
function deleteLi(deleteBtn){
	var deleteLi=$(deleteBtn).closest(".deploy-list-none");
	$(deleteLi).remove();
}
/*$(".deleteBtn").click(function(){
	var deleteLi=$(this).closest(".deploy-list-none");
	$(deleteLi).remove();
});
*/