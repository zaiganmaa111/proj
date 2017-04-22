/**
 * Created by Administrator on 2017/3/31.
 */
$(function () {

    //检查输入的name-变量名是否跟数据库重复，保持唯一性
    $("#form-add-mongodb input").eq(5).bind({
        blur: function () {
            if ($("#form-add-mongodb input").eq(5).val() == "") {
                $("#form-add-mongodb input").eq(5).siblings("span").remove();
                var html = "<span style='color:red;'>请输入变量名！</span>";
                $("#form-add-mongodb input").eq(5).parent(".col-sm-8").append(html);
                $("#form-add-mongodb select").eq(3).children("option").attr({"disabled": "disabled"});
            } else {
                $("#form-add-mongodb select").eq(3).children("option").attr({"disabled": false});
                var data = {
                    name: $("#form-add-mongodb input").eq(5).val()
                };
                //console.log(data);
                $.ajax({
                    url: '/examine',
                    data: data,
                    type: 'POST',
                    success: function (data) {
                        //console.log(data.OK);
                        if (data.OK == 1) {
                            $("#form-add-mongodb input").eq(5).siblings("span").remove();
                            var html = "<span>这变量名可用！</span>";
                            $("#form-add-mongodb input").eq(5).parent(".col-sm-8").append(html);
                        } else if (data.OK == 0) {
                            $("#form-add-mongodb input").eq(5).siblings("span").remove();
                            var html = "<span style='color:red;'>这变量名不可用！</span>";
                            $("#form-add-mongodb input").eq(5).parent(".col-sm-8").append(html);
                            $("#form-add-mongodb select").eq(3).children("option").attr({"disabled": "disabled"});
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }
        }
    });

    //检查添加输入的parameterId-变量名是否跟数据库重复，保持唯一性
    $("#form-add-mongodb input").eq(0).bind({
        blur: function () {
            if ($("#form-add-mongodb input").eq(0).val() == "") {
                $("#form-add-mongodb input").eq(0).siblings("span").remove();
                var html = "<span style='color:red;'>请输入ID！</span>";
                $("#form-add-mongodb input").eq(0).parent(".col-sm-8").append(html);
            } else {
                var contionobj = JSON.parse($("#contion").html());
                var data = {
                    templateName: contionobj[0],
                    conmponeCode: contionobj[1],
                    name: $("#form-add-mongodb input").eq(6).val()
                };
                //console.log(data);
                $.ajax({
                    url: '/parameterIdCheck',
                    data: data,
                    type: 'POST',
                    success: function (data) {
                        //console.log(data.OK);
                        if (data.OK == 1) {
                            $("#form-add-mongodb input").eq(0).siblings("span").remove();
                            var html = "<span>这ID可用！</span>";
                            $("#form-add-mongodb input").eq(0).parent(".col-sm-8").append(html);
                        } else if (data.OK == 0) {
                            $("#form-add-mongodb input").eq(0).siblings("span").remove();
                            var html = "<span style='color:red;'>这ID不可用！</span>";
                            $("#form-add-mongodb input").eq(0).parent(".col-sm-8").append(html);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }
        }
    });

    //console.log($("#dianji-tbody tr").length);
    /*修改数据*/
    $("#update-mongodb").click(function () {
        //遍历审查有没有漏填。
        for (var i = 0; i < $("#form-update input").length; i++) {
            if ($("#form-update input").eq(i).val() == "") {
                return console.log("没填数据");
            }
        }
        var du = 0;
        if ($("#form-update select").eq(2).find("option:selected").text() == "可写") {
            du = 1
        }
        ;
        //console.log($("#form-update input").eq(5).val());
        var contionobj = JSON.parse($("#contion").html());
        var data;
        if($("#form-update select").eq(3).children("option:selected").text()=="Whole"){
            data = {
                templateName: contionobj[0],
                conmponeCode: contionobj[1],
                _id:$("#form-update input").eq(6).val(),
                //是否实时
                isTime: $("#form-update select").eq(0).find("option:selected").text(),
                //单位
                varunit: $("#form-update select").eq(1).find("option:selected").text(),
                //读/写
                access_type: du,
                //ID
                parameterId: $("#form-update input").eq(0).val(),
                //名称
                varchinesename: $("#form-update input").eq(1).val(),
                //描述
                chinesedesc: $("#form-update input").eq(2).val(),
                //最大值
                max: $("#form-update input").eq(3).val(),
                //最小值
                min: $("#form-update input").eq(4).val(),
                //变量名
                name: $("#form-update input").eq(5).val(),
                //strategy
                strategy:$("#form-update select").eq(3).children("option:selected").text(),
                //table desc
                desc:$("#form-add-mongodb table").eq(0).children("tbody").children("tr").eq(0).children("td").eq(0).children("input").eq(0).val(),
                //table coefficient
                coefficient:$("#form-add-mongodb table").eq(0).children("tbody").children("tr").eq(3).children("td").eq(0).children("input").eq(0).val()
            };
        }
        else if($("#form-update select").eq(3).children("option:selected").text()=="GetBit"){
            //table表单数据
            var tablearry=[];

            for(var i=0;i<$("#form-update table").length;i++){
                var tr=$("#form-update table").eq(i).children("tbody").children("tr");
                var tableData={
                    desc:tr.eq(0).children("td").eq(0).children("input").eq(0).val(),
                    name:$("#form-update input").eq(5).val(),
                    index:tr.eq(2).children("td").eq(0).html(),
                    length:1,
                    coefficient:tr.eq(3).children("td").eq(0).children("input").eq(0).html(),
                    alias : "",
                    strategy:"GetBit",
                    access_type:du
                };
                tablearry.push(tableData);
            };
            //console.log(tablearry)
            data={
                tablearry:JSON.stringify(tablearry),
                templateName: contionobj[0],
                conmponeCode: contionobj[1],
                _id:$("#form-update input").eq(6).val(),
                //是否实时
                isTime: $("#form-update select").eq(0).find("option:selected").text(),
                //单位
                varunit: $("#form-update select").eq(1).find("option:selected").text(),
                //读/写
                access_type: du,
                //ID
                parameterId: $("#form-update input").eq(0).val(),
                //名称
                varchinesename: $("#form-update input").eq(1).val(),
                //描述
                chinesedesc: $("#form-update input").eq(2).val(),
                //最大值
                max: $("#form-update input").eq(3).val(),
                //最小值
                min: $("#form-update input").eq(4).val(),
                //变量名
                name: $("#form-update input").eq(5).val(),
                //strategy
                strategy:$("#form-update select").eq(3).children("option:selected").text()
            }
        }

        $.ajax({
            url: '/update',
            data: data,
            type: 'POST',
            success: function (data) {
                //var obj = JSON.parse(data);
                //console.log(data);
                if (data.ok == "1") {
                    $("#exampleModal1").removeClass("in");
                    $("#exampleModal1").attr({"aria-hidden": true});
                    $("#exampleModal1").css({"display": "none"});
                    $("div").remove(".modal-backdrop");
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    });

    /*添加数据*/
    $("#add-mongo").click(function () {
        //遍历审查有没有漏填。
        for (var i = 0; i < $("#form-add-mongodb input").length; i++) {
            if ($("#form-add-mongodb input").eq(i).val() == "") {
                $("#exampleModaladd .modal-footer").prepend($("<span style='color:red;'>请填完整数据！</span>"));
                return console.log("没填数据");
            }else{
                $("#exampleModaladd .modal-footer").children("span").remove();
            }
        }
        var contionobj = JSON.parse($("#contion").html());
        var du = 0;
        if ($("#form-add-mongodb select").eq(2).find("option:selected").text() == "可写") {
            du = 1
        }
        var data;
        if($("#form-add-mongodb select").eq(3).children("option:selected").text()=="Whole"){
            data = {

                templateName: contionobj[0],
                conmponeCode: contionobj[1],
                //是否实时
                isTime: $("#form-add-mongodb select").eq(0).find("option:selected").text(),
                //单位
                varunit: $("#form-add-mongodb select").eq(1).find("option:selected").text(),
                //读/写
                access_type: du,
                //ID
                parameterId: $("#form-add-mongodb input").eq(0).val(),
                //名称
                varchinesename: $("#form-add-mongodb input").eq(1).val(),
                //描述
                chinesedesc: $("#form-add-mongodb input").eq(2).val(),
                //最大值
                max: $("#form-add-mongodb input").eq(3).val(),
                //最小值
                min: $("#form-add-mongodb input").eq(4).val(),
                //变量名
                name: $("#form-add-mongodb input").eq(5).val(),
                //strategy
                strategy:$("#form-add-mongodb select").eq(3).children("option:selected").text(),
                //table desc
                desc:$("#form-add-mongodb table").eq(0).children("tbody").children("tr").eq(0).children("td").eq(0).children("input").eq(0).val(),
                //table coefficient
                coefficient:$("#form-add-mongodb table").eq(0).children("tbody").children("tr").eq(3).children("td").eq(0).children("input").eq(0).val()
            };
        }
        else if($("#form-add-mongodb select").eq(3).children("option:selected").text()=="GetBit"){
              //table表单数据
              var tablearry=[];
                
            for(var i=0;i<$("#form-add-mongodb table").length;i++){
              var tr=$("#form-add-mongodb table").eq(i).children("tbody").children("tr");
                    var tableData={
                        desc:tr.eq(0).children("td").eq(0).children("input").eq(0).val(),
                        name:$("#form-add-mongodb input").eq(5).val(),
                        index:tr.eq(2).children("td").eq(0).html(),
                        length:1,
                        coefficient:tr.eq(3).children("td").eq(0).children("input").eq(0).html(),
                        alias : "",
                        strategy:"GetBit",
                        access_type:du
                        };
                    tablearry.push(tableData);
            };
               data={
                    tablearry:JSON.stringify(tablearry),
                   templateName: contionobj[0],
                   conmponeCode: contionobj[1],
                   //是否实时
                   isTime: $("#form-add-mongodb select").eq(0).find("option:selected").text(),
                   //单位
                   varunit: $("#form-add-mongodb select").eq(1).find("option:selected").text(),
                   //读/写
                   access_type: du,
                   //ID
                   parameterId: $("#form-add-mongodb input").eq(0).val(),
                   //名称
                   varchinesename: $("#form-add-mongodb input").eq(1).val(),
                   //描述
                   chinesedesc: $("#form-add-mongodb input").eq(2).val(),
                   //最大值
                   max: $("#form-add-mongodb input").eq(3).val(),
                   //最小值
                   min: $("#form-add-mongodb input").eq(4).val(),
                   //变量名
                   name: $("#form-add-mongodb input").eq(5).val(),
                   //strategy
                   strategy:$("#form-add-mongodb select").eq(3).children("option:selected").text()
               }
        }
        //console.log(data);
        $.ajax({
            url: '/add',
            data: data,
            type: 'POST',
            success: function (result) {
                if (result.ok == "yes") {
                    var xie = "R";
                    if (data.access_type == 0) {
                        xie = "R";
                    } else if (data.access_type == 1) {
                        xie = "W";
                    }
                    ;
                    var html = " <tr>" +
                        "<th>" + xie + "</th>" +
                        "<td>" + data.varchinesename + "</td>" +
                        "<th>-</th>" +
                        "<th>" + data.varunit + "</th>" +
                        "<td>" + data.chinesedesc + "</td>" +
                        "<td>" + data.parameterId + "</td>" +
                            <!--存最大值-->
                        "<td style='display: none'>" + data.max + "</td>" +
                            <!--存最小值-->
                        "<td style='display: none'>" + data.min + "</td>" +
                            <!--存字典表查询更新条件-varname-->
                        "<td style='display: none'>" + data.varname + "</td>" +
                        "<td>" +
                        "<a href='#' data-toggle='modal' data-target='#exampleModal' data-whatever='@mdo' data-toggle='modal' data-target='#myModaldata-backdrop='static'>" +
                        "查看</a>&nbsp;&nbsp;" +
                        "<a href='#' data-toggle='modal' data-target='#exampleModal1' data-whatever='@mdo' data-toggle='modal' data-target='#myModal' data-backdrop='static'>" +
                        "修改</a>&nbsp;&nbsp;" +
                        "<a href='#'>删除</a>&nbsp;&nbsp;" +
                        "<a href='#' data-toggle='modal' data-target='#exampleModal3' data-whatever='@mdo' data-toggle='modal' data-target='#myModal' data-backdrop='static'>" +
                        "控制</a>&nbsp;&nbsp;" +
                        "<a href='#'>添加到观察</a>" +
                        "</td>" +
                        "</tr>";
                    $("#dianji-tbody").append(html);
                    //console.log("关闭模态框");
                    $("#exampleModaladd").removeClass("in");
                    $("#exampleModaladd").attr({"aria-hidden": true});
                    $("#exampleModaladd").css({"display": "none"});
                    $("div").remove(".modal-backdrop");
                }
            },
            error: function (err) {
                console.log(err);
            }
        });

    });

    /*控制、修改、查看初始内容数据处理*/
    //console.log($("#dianji-tbody a"))
    $("#dianji-tbody a").click(function () {
        if ($(this).html() == "控制") {
            //console.log($("#exampleModal .col-sm-8").eq(1))
            //console.log($(this).parent("td").siblings());
            //id
            $("#exampleModal3 .col-sm-8").eq(1).html($(this).parent("td").siblings().eq(5).html());
            //名称
            $("#exampleModal3 .col-sm-8").eq(2).html($(this).parent("td").siblings().eq(1).html());
            //单位
            $("#exampleModal3 .col-sm-8").eq(3).html($(this).parent("td").siblings().eq(3).html());
            //描述
            $("#exampleModal3 .col-sm-8").eq(4).html($(this).parent("td").siblings().eq(4).html());
            //读/写
            $("#exampleModal3 .col-sm-8").eq(5).html($(this).parent("td").siblings().eq(0).html());
            //最大值
            $("#exampleModal3 .col-sm-8").eq(6).html($(this).parent("td").siblings().eq(6).html());
            //最小值
            $("#exampleModal3 .col-sm-8").eq(7).html($(this).parent("td").siblings().eq(7).html());
            //当前值
            $("#exampleModal3 .col-sm-8").eq(8).html($(this).parent("td").siblings().eq(2).html());
        }
        else if ($(this).html() == "修改") {
            //console.log($("#exampleModal1 input[type='text']"))
            //id
            $("#exampleModal1 input[type='text']").eq(0).val($(this).parent("td").siblings().eq(5).html());
            //名称
            $("#exampleModal1 input[type='text']").eq(1).val($(this).parent("td").siblings().eq(1).html());
            //描述
            $("#exampleModal1 input[type='text']").eq(2).val($(this).parent("td").siblings().eq(4).html());
            //最大值
            $("#exampleModal1 input[type='text']").eq(3).val($(this).parent("td").siblings().eq(6).html());
            //最小值
            $("#exampleModal1 input[type='text']").eq(4).val($(this).parent("td").siblings().eq(7).html());
            //hidden 字典表查询、更新条件-varname
            $("#exampleModal1 input[type='hidden']").eq(0).val($(this).parent("td").siblings().eq(8).html());
            //hidden segmentid
            $("#exampleModal1 input[type='hidden']").eq(1).val($(this).parent("td").siblings().eq(9).html());
            //hidden strategy
            $("#exampleModal1 input[type='hidden']").eq(2).val($(this).parent("td").siblings().eq(10).html());

             var WG;
              if($("#exampleModal1 input[type='hidden']").eq(2).val()=="Whole"){
                  $("#form-update select").eq(3).children("option").eq(0).attr({"selected":true});
                  WG="Whole";
                  $("#form-update table").remove();
                  var html = '<table style="width: 50%;float: left;margin-right: 0px;" class="table table-bordered table-striped table-condensed">' +
                      '<tr>' +
                      '<th class="col-md-3 col-sm-1">desc</th>' +
                      '<td><input class="form-control " placeholder="0" type="text" value='+$(this).parent("td").siblings().eq(11).html()+'> </td>' +
                      '</tr>' +
                      '<tr>' +
                      '<tr style="display:none;">' +
                      '<th>index</th>' +
                      '<td>0</td>' +
                      '</tr>' +
                      '<tr>' +
                      '<th>coefficient</th>' +
                      '<td><input class="form-control "  placeholder="0" type="text" value='+$(this).parent("td").siblings().eq(12).html()+'> </td>' +
                      '</tr>' +
                      '<tr>' +
                      '</table>';
                  $("#form-update").append(html);
              }else if($("#exampleModal1 input[type='hidden']").eq(2).val()=="GetBit"){
                  $("#form-update select").eq(3).children("option").eq(1).attr({"selected":true});
                  WG="GetBit";
                  var html;
                  for (var i = 0; i < 15; i++) {
                      html = '<table style="width: 50%;float: left;margin-right: 0px;" class="table table-bordered table-striped table-condensed">' +
                          '<tr>' +
                          '<th class="col-md-3 col-sm-1">desc</th>' +
                          '<td><input class="form-control "  placeholder="0" type="text"/> </td>' +
                          '</tr>' +
                          '<tr>' +
                          '<tr style="display:none;">' +
                          '<th>index</th>' +
                          '<td>'+i+'</td>' +
                          '</tr>' +
                          '<tr>' +
                          '<th>coefficient</th>' +
                          '<td><input class="form-control "  placeholder="0" type="text"/> </td>' +
                          '</tr>' +
                          '<tr>' +
                          '</table>';
                      $("#form-update").append(html);
                  }
              }

                //console.log($("#exampleModal1 input[type='hidden']").eq(2).val());
            $("#form-update select").eq(3).change(function () {
                WG = ($(this).children("option:selected").text());
                if (WG == "GetBit") {
                    var html;
                    for (var i = 0; i < 15; i++) {
                        html = '<table style="width: 50%;float: left;margin-right: 0px;" class="table table-bordered table-striped table-condensed">' +
                            '<tr>' +
                            '<th class="col-md-3 col-sm-1">desc</th>' +
                            '<td><input class="form-control "  placeholder="0" type="text"/> </td>' +
                            '</tr>' +
                            '<tr>' +
                            '<tr style="display:none;">' +
                            '<th>index</th>' +
                            '<td>'+i+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<th>coefficient</th>' +
                            '<td><input class="form-control "  placeholder="0" type="text"/> </td>' +
                            '</tr>' +
                            '<tr>' +
                            '</table>';
                        $("#form-update").append(html);
                    }

                }
                else if (WG == "Whole") {
                    $("#form-update table").remove();
                   var html = '<table style="width: 50%;float: left;margin-right: 0px;" class="table table-bordered table-striped table-condensed">' +
                        '<tr>' +
                        '<th class="col-md-3 col-sm-1">desc</th>' +
                        '<td><input class="form-control "  placeholder="0" type="text"/> </td>' +
                        '</tr>' +
                        '<tr>' +
                        '<tr style="display:none;">' +
                        '<th>index</th>' +
                        '<td>'+i+'</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<th>coefficient</th>' +
                        '<td><input class="form-control "  placeholder="0" type="text"/> </td>' +
                        '</tr>' +
                        '<tr>' +
                        '</table>';
                    $("#form-update").append(html);

                }
            });

        }
        else if ($(this).html() == "查看") {

            var contionobj = JSON.parse($("#contion").html());

            var data = {
                name: $(this).parent("td").siblings().eq(8).html(),
                templateName: contionobj[0],
                conmponeCode: contionobj[1],
                parameterId: $(this).parent("td").siblings().eq(5).html()
            };

            $.ajax({
                url: '/lookData',
                data: data,
                type: 'POST',
                success: function (data) {
                    //var obj = JSON.parse(data);
                    //console.log(obj)
                    //console.log(data[0].ioTag);
                    ////id
                    //$("#exampleModal .col-sm-8").eq(2).html(data[0].parameterId);
                    ////名称
                    //$("#exampleModal .col-sm-8").eq(3).html(data[1].varchinesename);
                    ////单位
                    //$("#exampleModal .col-sm-8").eq(4).html(data[1].varunit);
                    ////描述
                    //$("#exampleModal .col-sm-8").eq(5).html(data[1].chinesedesc);
                    ////读/写
                    //$("#exampleModal .col-sm-8").eq(0).children("select").empty();
                    var html = "";
                    var du="";
                    $("#exampleModal .modal-body").children('hr').remove();
                    $("#exampleModal .modal-body").children('form').remove();
                    for (var i = 0; i < data[0].ioTag.length; i++) {
                         if(data[0].ioTag[i].access_type=="0"){
                             du="R";
                         }else if(data[0].ioTag[i].access_type=="1"){
                             du="W";
                         }
                        html += '<hr/><form class="form-horizontal">' +
                            '<div class="form-group">' +
                            '<label for="" class="col-sm-4 control-label" >变量名：</label>' +
                            '<div class="col-sm-8">'+data[0].ioTag[i].name+'</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-sm-4 control-label" >是否实时读取：</label>' +
                            '<div class="col-sm-8">是</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-sm-4 control-label" >ID：</label>' +
                            '<div class="col-sm-8">' + data[0].parameterId + '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-sm-4 control-label" >名称：</label>' +
                            '<div class="col-sm-8">' + data[1].varchinesename + '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-sm-4 control-label" >单位：</label>' +
                            '<div class="col-sm-8">' + data[1].varunit + '</div>' +
                            '</div>' +

                            '<div class="form-group">' +
                            '<label for="" class="col-sm-4 control-label" >描述：</label>' +
                            '<div class="col-sm-8">' + data[1].chinesedesc + '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-sm-4 control-label" >读/写：</label>' +
                            '<div class="col-sm-8">'+du+'</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-sm-4 control-label" >最大值：</label>' +
                            '<div class="col-sm-8">' + data[1].max + '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label for="" class="col-sm-4 control-label" >最小值：</label>' +
                            '<div class="col-sm-8">' + data[1].mix + '</div>' +
                            '</div>' +
                            '</form>';
                        $("#exampleModal .modal-body").append(html);
                    }
                    ;
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
        else if ($(this).html() == "删除") {
            /*删除数据*/
            var contionobj = JSON.parse($("#contion").html());
            var tr = $(this).parents("tr");
            var data = {
                name: $(this).parent("td").siblings().eq(8).html(),
                templateName: contionobj[0],
                conmponeCode: contionobj[1],
                parameterId: $(this).parent("td").siblings().eq(5).html()
            };
            $.ajax({
                url: '/det',
                data: data,
                type: 'POST',
                success: function (data) {
                    if (data.ok == 1) {
                        tr.remove();
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }

    });


});