/**
 * Created by Administrator on 2017/3/31.
 */

$(function(){
    var socket = io.connect('http://127.0.0.1/');

    //�ӷ����������Ϣ
    socket.on("zIdata", function(msg){
         //console.log(msg.data)
      var canHtml=$("table").eq(0).children("tbody").children("tr").children("th").eq(1);
       canHtml.html(msg.data[0])
    });
});