/**
 * Created by Administrator on 2017/3/31.
 */

$(function(){

    //可读否
    var WR= $("table").eq(0).children("tbody").children("tr").children("th").eq(0)
    if(WR.eq(0).html()=="0"){
        WR.html('R')
    }

    var Control=$("table").eq(0).children("tbody").children("tr").children("td").eq(3).children("a").eq(3)
    //console.log(Unpate.html())
    Control.click(function(){
        if(WR.html()=="R"){
            return false;
        }else if(WR.html()=="W"){

        }
    });



    //'<tr>' +
    //'<th>length</th>' +
    //'<td>1</td>' +
    //'</tr>' +
    //模态框结构添加
    if($("#form-add-mongodb input").eq(5).val()=="") {
        $("#form-add-mongodb select").eq(3).children("option").attr({"disabled": "disabled"});
    }
        $("#form-add-mongodb select").eq(3).change(function () {
            var WG = ($(this).children("option:selected").text());
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
                        '</table>';
                    $("#form-add-mongodb").append(html);
                }

            }
            else if (WG == "Whole") {
                $("#form-add-mongodb table").remove();
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
                    '</table>'
                $("#form-add-mongodb").append(html);

            }
        });

    ////继续添加
    //var add_btn=$("#form-add-mongodb td[type='button']");
    //console.log($("#form-add-mongodb td[type='button']"));
    //add_btn.click(function(){
    //    console.log(123)
    //    console.log($(this).children("tr").children("td").eq(3).html());
    //    if($(this).children("tr").children("td").eq(3).html()){
    //
    //    }
    //})
});
