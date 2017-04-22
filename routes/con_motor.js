var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var querystring = require("querystring");
var promise = require('promise');
var Q = require('q');
var ObjectId = require('mongodb').ObjectId;


//找到全部的参数列表
var getams_iotagsInofo = function (callback) {
    var deffered = Q.defer();
    mongoHelp.mongoFindAll("AMS_TAGS_INFO", function (result) {
        deffered.resolve(result);
    });
    return deffered.promise.nodeify(callback);
}
//获取全部通道信息
var getams_allChannel = function (callback) {
    var deffered = Q.defer();
    mongoHelp.mongoFindAll("CHANNEL_SETTINGS", function (result) {
        deffered.resolve(result);
    });
    return deffered.promise.nodeify(callback);
}
var getams_allzdb = function(callback){
    var deffered = Q.defer();
    mongoHelp.mongoFindAll("DATA_DICTIONARY", function (result) {
        deffered.resolve(result);
    });
    return deffered.promise.nodeify(callback);
}




/**
 * 更具 设备唯一编号，部件号，拿到模板加载html
 * deviceUniKey 设备唯一编号，key 部件号
 * */
var getams_allioTag_allChannel = function(deviceUniKey,key){
    var infos_iotags = getams_allChannel();
    var infos_line_configuration = getams_iotagsInofo();
    var infos_allzdb = getams_allzdb();
    return Q.all([infos_line_configuration,infos_iotags,infos_allzdb]).then(function (pdata) {
        var arr = []; var templateName = ""; var componentCode = "";
        pdata[1].data[0].channels.channel = pdata[1].data[0].channels.channel.map(function (varchannel) {
            varchannel.endPoints.endPoint = varchannel.endPoints.endPoint.map(function (varendPoint) {
                if(varendPoint.key==(""+key) && varchannel.deviceUniKey==(""+deviceUniKey)  && varendPoint.enable=="true"){
                    pdata[0].data[0].tags.map(function (vartags) {
                        if(varendPoint.key==vartags.componentCode && varendPoint.templateName==vartags.templateName && vartags.dataType=="collect"){
                            componentCode = varendPoint.key; templateName = varendPoint.templateName;
                            vartags.segment.map(function(varsegment){
                                var seg = {};
                                var desc = ""; var num = 0;  var chaname=""; var min = 0; var max= 0;var varunit ="";var zdbId= "";
                                pdata[2].data.map(function(varzdb){
                                    if((varzdb.varname+"") == varsegment.name){
                                        zdbId = varzdb._id;
                                        min = varzdb.min;
                                        max = varzdb.max;
                                        desc = varzdb.chinesedesc;
                                        chaname = varzdb.varchinesename;
                                        varunit  = varzdb.varunit;
                                    }
                                });
                                varsegment.ioTag.map(function(varioTag){
                                    if(varsegment.ioTag.length>1){
                                        desc+= "["+num+"]" + varioTag.desc;
                                        num++;
                                    }else{
                                        desc +=  varioTag.desc;
                                    }
                                });

                                seg["desc"] = desc;
                                seg["_id"] = varsegment._id;
                                seg["parameterId"] = varsegment.parameterId;
                                seg["access_type"] = varsegment.access_type;
                                seg["max"] = max;
                                seg["min"] = min;
                                seg["chaname"] = chaname;
                                seg["varunit"] = varunit;
                                seg["zdbId"] = zdbId;
                                arr.push(seg);
                            });
                        }
                    });
                }
            });
        });
        return {
            wfInfo: arr,
            templateName:templateName,
            componentCode:componentCode
        };
    });
}
var getams_oneSegment = function(id,templateName,componentCode,act){
    var infos_line_configuration = getams_iotagsInofo();//艾默生模板表
    var infos_allzdb = getams_allzdb();//字典表
    return Q.all([infos_line_configuration,infos_allzdb]).then(function (pdata) {
        var arr = [];
        pdata[0].data[0].tags = pdata[0].data[0].tags.map(function (vartags) {
            if(vartags.templateName == templateName && vartags.componentCode == componentCode && vartags.dataType=="collect"){
                vartags.segment.map(function(varsegment){
                     var chinesedesc;var num = 0;  var chaname=""; var min = 0; var max= 0;var varunit ="";var zdbId= "";
                    var ioTagSize= 0;
                    if(varsegment._id+""== id+""){
                        var seg = {};seg["ioTag"] =[];
                        pdata[1].data.map(function(varzdb){
                            if(varzdb.varname==varsegment.name){
                                zdbId = varzdb._id;
                                min = varzdb.min;
                                max = varzdb.max;
                                chinesedesc = varzdb.chinesedesc;
                                chaname = varzdb.varchinesename;
                                varunit  = varzdb.varunit;
                            }
                        });
                        varsegment.ioTag.map(function(varioTag){
                            var ioTag = {};
                            ioTag["coefficient"] = varioTag.coefficient;
                            ioTag["strategy"] = varioTag.strategy;
                            ioTag["desc"] = varioTag.desc;
                            seg["ioTag"].push(ioTag);
                        });
                        seg["isTime"] = varsegment.isTime;
                        seg["_id"] = varsegment._id;
                        seg["parameterId"] = varsegment.parameterId;
                        seg["access_type"] = varsegment.access_type;
                        seg["max"] = max;
                        seg["min"] = min;
                        seg["chaname"] = chaname;
                        seg["varunit"] = varunit;
                        seg["zdbId"] = zdbId;
                        arr.push(seg);
                    }
                });
            }
        });
        return {
            wfInfo: arr,
        };
    });
}




router.get('/duk/:duk/:key', function (req, res) {
    var promise = getams_allioTag_allChannel(req.params.duk,req.params.key);
    promise.then(function (result) {
        res.render("con_motor", {alldata:result});
    });
});


router.post('/add/:componentCode/:templateName', function (req, res) {
    var valueInfo = new Object();
    valueInfo.templateName = req.params.templateName;
    valueInfo.componentCode = req.params.componentCode;
    valueInfo.seg = JSON.parse(req.body.seg);
    valueInfo.zdb = JSON.parse(req.body.zdb);
    mongoHelp.updGetBitsegaddzdb( valueInfo, function (result) {
        res.send(result);
    });
});

router.post('/look/:componentCode/:templateName/:objId', function (req, res) {
    var valueInfo = new Object();
    valueInfo.templateName = req.params.templateName;
    valueInfo.componentCode = req.params.componentCode;
    valueInfo.objId = req.params.objId;
    var promise = getams_oneSegment(req.params.objId,req.params.templateName,req.params.componentCode);
    promise.then(function (result) {
        res.send(result);
    });
});
router.post('/upd/:componentCode/:templateName/:objId', function (req, res) {
    var valueInfo = new Object();
    valueInfo.templateName = req.params.templateName;
    valueInfo.componentCode = req.params.componentCode;
    valueInfo.objId = req.params.objId;
    var promise = getams_oneSegment(req.params.objId,req.params.templateName,req.params.componentCode);
    promise.then(function (result) {
        res.send(result);
    });
});

module.exports = router;