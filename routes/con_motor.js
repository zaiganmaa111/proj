var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var querystring = require("querystring");
var promise = require('promise');
var Q = require('q');
var ObjectId = require('mongodb').ObjectId;
var redis = require('./redis');
var crypto = require('crypto');



//�ҵ�ȫ���Ĳ����б�
var getams_iotagsInofo = function (callback) {
    var deffered = Q.defer();
    mongoHelp.mongoFindAll("AMS_TAGS_INFO", function (result) {
        deffered.resolve(result);
    });
    return deffered.promise.nodeify(callback);
}
//��ȡȫ��ͨ����Ϣ
var getams_allChannel = function (callback) {
    var deffered = Q.defer();
    mongoHelp.mongoFindAll("CHANNEL_SETTINGS", function (result) {
        deffered.resolve(result);
    });
    return deffered.promise.nodeify(callback);
}
var getams_allzdb = function (callback) {
    var deffered = Q.defer();
    mongoHelp.mongoFindAll("DATA_DICTIONARY", function (result) {
        deffered.resolve(result);
    });
    return deffered.promise.nodeify(callback);
}

var add_to_monitor_q = function (uid, vname, tree_uuid, callback) {
    var deffered = Q.defer();

    mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, collection) {
        console.log("in");
        collection.update(
            { "uid": uid, "tree_id": 'monitor' },
            { "$addToSet": { "var_name": vname } },
            function (err, r) {
                deffered.resolve(err == null);
            });
    });
    return deffered.promise.nodeify(callback);
}

var get_menu_var_q = function (_oid, uid, callback) {
    var deffered = Q.defer();
    var oid = new ObjectId(_oid);
    mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, collection) {
        console.log("in");

        var m = collection.findOne({ _id: oid, uid: uid }, function (err, doc) {

            deffered.resolve(doc.var_name);

        })
    })
    return deffered.promise.nodeify(callback);
}

var get_segments_q = function (templateName, vnset, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInit("AMS_TAGS_INFO", function (err, collection) {
        console.log("in");

        var m = collection.findOne({}, function (err, doc) {
            //assert.equal(err, null);
            //assert.equal(doc.length, 1);
            var md = doc.tags.map(function (e, index) {
                e.index = index
                return e;
            }).filter(function (e) {
                return e.templateName == templateName
            })[0];

            md.segment = md.segment.map(function (e, index) {
                e.index = index
                return e
            }).filter(function (e) {
                return vnset.indexOf(e.name) > -1
            })
            deffered.resolve(md);
            // var m = doc[0].tags[0].segment.filter(function(e){
            // return vnset.indexOf(e.name) > -1
        })
        // console.log(m)
        // deffered.resolve(doc[0].tags[0].segment.filter(function(e, oindex){
        //     return vnset.indexOf(e.name) > -1
        // }) );
    })
    return deffered.promise.nodeify(callback);
}


var add_to_tree_q = function (vname, _id, callback) {
    var deffered = Q.defer();
    var oid = new ObjectId(_id);
    mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, collection) {
        console.log("in");
        collection.findOneAndUpdate({ "_id": oid },
            { "$addToSet": { "var_name": vname } },
            function (err, r) {
                deffered.resolve(err == null)
            });
    });
    return deffered.promise.nodeify(callback);
}

var test_for_monitor_q = function (uid, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInitWithDb().then(function (err_db) {
        var db = err_db.db;
        db.collection("PERMISSIONS_TREE", function (err, collection) {
            console.log("in");
            //deffered.resolve("r.insertedId");
            collection.findOne({ "uid": uid, "tree_id": 'monitor' }, function (err, doc) {
                if (doc == null) {
                    var time = new Date().toTimeString();
                    collection.insertOne(
                        {
                            tree_name: "观察",
                            var_name: [],
                            createTime: time,
                            updateTime: time,
                            tree_id: 'monitor',
                            uid: uid,
                            menu_name: "观察",
                            istrue: false
                        }, function (err, r) {
                            db.close();
                            deffered.resolve(r.insertedId);
                        })

                } else {
                    db.close();
                    deffered.resolve(doc._id);
                }
            })
        })
    })

    return deffered.promise.nodeify(callback);
}


// var test_for_monitor_q = function (uid, callback) {
//     var deffered = Q.defer();
//     mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, collection) {
//         console.log("in");
//         collection.findOne({ "uid": uid }, { "uuid": 'monitor' }, function (err, doc) {
//             if (doc == null) {
//                 var time = new Date().toTimeString();
//                 mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, incol) {
//                     incol.insertOne(
//                         {
//                             tree_name: "观察",
//                             var_name: [],
//                             createTime: time,
//                             updateTime: time,
//                             tree_id: 'monitor',
//                             uid: uid,
//                             caidan_name_hash: '',
//                             caidan_name: "观察",
//                             istrue: false
//                         }, function (err, r) {
//                             deffered.resolve(r.insertedId);
//                         })
//                 })
//             } else {
//                 deffered.resolve(doc._id);
//             }
//         })
//     });

//     return deffered.promise.nodeify(callback);
// }

var add_cons_q = function (_id, tag_index, update, tree_oid, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInit("AMS_TAGS_INFO", function (err, collection) {
        collection.find({ 'tags.segment.name': update.name }).toArray(function (err, doc) {

            if (doc == null || doc.length == 0) {
                mongoHelp.mongoInit("AMS_TAGS_INFO", function (err, collection) {
                    var oid = new ObjectId(_id);
                    var ud = new Object();
                    var indexStr = 'tags.' + tag_index + '.segmeent';

                    var time = new Date().toTimeString();
                    var md5 = crypto.createHash('md5');
                    md5.update(time);
                    md5.update(update.name);
                    update._id = md5.digest('base64');

                    ud[indexStr] = update;
                    collection.update({ _id: oid },
                        { "$push": ud }, function (err, r) {
                            add_to_tree_q(update.name, tree_oid).then(function (data) {
                                deffered.resolve(update._id)
                            })
                        })
                })
            } else {
                deffered.resolve("")
            }
        })
    })

    return deffered.promise.nodeify(callback);
}

var update_cons_q = function (_id, tag_index, seg_index, udata, callback) {
    var deffered = Q.defer();
    var oid = new ObjectId(_id);
    mongoHelp.mongoInit("AMS_TAGS_INFO", function (err, collection) {
        console.log("in");
        var ts_string = "tags." + tag_index + ".segment." + seg_index;
        var ud = new Object();
        ud[ts_string] = udata;
        collection.updateOne({ '_id': oid },
            { "$set": ud },
            function (err, r) {
                deffered.resolve(err == null);
            });
    });

    return deffered.promise.nodeify(callback);
}

var del_cons_q = function (_id, tag_index, seg_id, var_name, callback) {
    var oid = new ObjectId(_id);
    var tagString = "tags." + tag_index + ".segment"

    var deffered = Q.defer();
    mongoHelp.mongoInit("AMS_TAGS_INFO", function (err, collection) {
        console.log("in");

        var ud = new Object();
        ud[tagString] = { '_id': seg_id };

        collection.updateOne({ '_id': oid },
            { $pull: ud }, function (err, r) {
                mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, collection) {
                    console.log("in");

                    collection.updateMany(
                        { "var_name": var_name },
                        { "$pull": { "var_name": var_name } }, function (err, r) {
                            deffered.resolve(err == null);
                        });
                });
            });


    });

    return deffered.promise.nodeify(callback);
}

var get_user_tree_q = function (uid, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, collection) {
        console.log("in");
        collection.find(
            {
                uid: uid
            }).toArray(function (err, doc) {
                var dd = doc.map(function (e) {
                    return e.tree_name;
                    // return {
                    //     turbine: curTurbine,
                    //     ipno: curTurbine.Ipno
                    // };
                }).sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                });
                var result = dd.map(function (tree_name) {
                    var o = new Object();
                    o[tree_name] = doc.filter(function (item) {
                        return item.tree_name == tree_name;
                    })
                    return o;
                }
                );
                deffered.resolve(result);
            })
    })

    return deffered.promise.nodeify(callback);
}

var add_tree_q = function (tree_name, menu_name, uid, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, collection) {
        console.log("in");
        var time = new Date().toTimeString();

        var md5 = crypto.createHash('md5');
        md5.update(time);
        md5.update(tree_name);
        var tree_id = md5.digest('base64');

        collection.insertOne(
            {
                tree_name: tree_name,
                tree_id: tree_id,
                var_name: [],
                createTime: time,
                updateTime: time,
                uid: uid,
                menu_name: menu_name,
                istrue: false
            }, function (err, r) {
                deffered.resolve(err == null ? tree_id : null);
            });
    });

    return deffered.promise.nodeify(callback);
}

var add_menuto_tree_q = function (tree_id, tree_name, menu_name, uid, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, collection) {
        console.log("in");
        var time = new Date().toTimeString();

        collection.insertOne(
            {
                tree_name: tree_name,
                tree_id: tree_id,
                var_name: [],
                createTime: time,
                updateTime: time,
                uid: uid,
                menu_name: menu_name,
                istrue: false
            }, function (err, r) {
                deffered.resolve(err == null ? tree_id : null);
            });
    });

    return deffered.promise.nodeify(callback);
}

var apply_tree_q = function (tree_id, uid, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, collection) {
        console.log("in");
        var time = new Date().toTimeString();
        collection.updateMany(
            { 'uid': uid, 'istrue': true },
            { $set: { 'istrue': false, updateTime: time } }, function (err, r) {
                mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, collection) {
                    console.log("in");
                    var time = new Date().toTimeString();
                    collection.updateMany(
                        { 'tree_id': tree_id, 'uid': uid },
                        { $set: { 'istrue': true, updateTime: time } }, function (err, r) {
                            deffered.resolve(err == null);
                        });
                });
            });
    });

    return deffered.promise.nodeify(callback);
}

var update_tree_name_q = function (tree_id, tree_name, uid, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, collection) {
        console.log("in");
        var time = new Date().toTimeString();
        collection.updateMany(
            { 'tree_id': tree_id, 'uid': uid },
            { $set: { 'tree_name': tree_name, updateTime: time } }, function (err, r) {
                deffered.resolve(err == null);
            })
    });

    return deffered.promise.nodeify(callback);
}

var update_menu_name_q = function (oid, menu_name, uid, callback) {
    var deffered = Q.defer();
    var id = new ObjectId(oid);
    mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, collection) {
        console.log("in");
        var time = new Date().toTimeString();
        collection.updateMany(
            { '_id': id, 'uid': uid },
            { $set: { 'menu_name': menu_name, updateTime: time } }, function (err, r) {
                deffered.resolve(err == null);
            })
    });

    return deffered.promise.nodeify(callback);
}

var delete_tree_q = function (tree_id, uid, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, collection) {
        console.log("in");

        collection.deleteMany(
            { 'tree_id': tree_id, 'uid': uid }, function (err, r) {
                deffered.resolve(err == null);
            })
    });

    return deffered.promise.nodeify(callback);
}

var delete_menu_q = function (oid, callback) {
    var deffered = Q.defer();
    var id = new ObjectId(oid);
    mongoHelp.mongoInit("PERMISSIONS_TREE", function (err, collection) {
        console.log("in");

        collection.findOneAndDelete(
            { '_id': id }, function (err, r) {
                deffered.resolve(err == null);
            })
    });

    return deffered.promise.nodeify(callback);
}
/**
 * ���� �豸Ψһ���ţ������ţ��õ�ģ������html
 * deviceUniKey �豸Ψһ���ţ�key ������
 * */
var getams_allioTag_allChannel = function (deviceUniKey, key) {
    var infos_iotags = getams_allChannel();
    var infos_line_configuration = getams_iotagsInofo();
    var infos_allzdb = getams_allzdb();
    return Q.all([infos_line_configuration, infos_iotags, infos_allzdb]).then(function (pdata) {
        var arr = []; var templateName = ""; var componentCode = "";
        pdata[1].data[0].channels.channel = pdata[1].data[0].channels.channel.map(function (varchannel) {
            varchannel.endPoints.endPoint = varchannel.endPoints.endPoint.map(function (varendPoint) {
                if (varendPoint.key == ("" + key) && varchannel.deviceUniKey == ("" + deviceUniKey) && varendPoint.enable == "true") {
                    pdata[0].data[0].tags.map(function (vartags) {
                        if (varendPoint.key == vartags.componentCode && varendPoint.templateName == vartags.templateName && vartags.dataType == "collect") {
                            componentCode = varendPoint.key; templateName = varendPoint.templateName;
                            vartags.segment.map(function (varsegment) {
                                var seg = {};
                                var desc = ""; var num = 0; var chaname = ""; var min = 0; var max = 0; var varunit = ""; var zdbId = "";
                                pdata[2].data.map(function (varzdb) {
                                    if ((varzdb.varname + "") == varsegment.name) {
                                        zdbId = varzdb._id;
                                        min = varzdb.min;
                                        max = varzdb.max;
                                        desc = varzdb.chinesedesc;
                                        chaname = varzdb.varchinesename;
                                        varunit = varzdb.varunit;
                                    }
                                });
                                varsegment.ioTag.map(function (varioTag) {
                                    if (varsegment.ioTag.length > 1) {
                                        desc += "[" + num + "]" + varioTag.desc;
                                        num++;
                                    } else {
                                        desc += varioTag.desc;
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
            templateName: templateName,
            componentCode: componentCode
        };
    });
}
var getams_oneSegment = function (id, templateName, componentCode, act) {
    var infos_line_configuration = getams_iotagsInofo();//��Ĭ��ģ����
    var infos_allzdb = getams_allzdb();//�ֵ���
    return Q.all([infos_line_configuration, infos_allzdb]).then(function (pdata) {
        var arr = [];
        pdata[0].data[0].tags = pdata[0].data[0].tags.map(function (vartags) {
            if (vartags.templateName == templateName && vartags.componentCode == componentCode && vartags.dataType == "collect") {
                vartags.segment.map(function (varsegment) {
                    var chinesedesc; var num = 0; var chaname = ""; var min = 0; var max = 0; var varunit = ""; var zdbId = "";
                    var ioTagSize = 0;
                    if (varsegment._id + "" == id + "") {
                        var seg = {}; seg["ioTag"] = [];
                        pdata[1].data.map(function (varzdb) {
                            if (varzdb.varname == varsegment.name) {
                                zdbId = varzdb._id;
                                min = varzdb.min;
                                max = varzdb.max;
                                chinesedesc = varzdb.chinesedesc;
                                chaname = varzdb.varchinesename;
                                varunit = varzdb.varunit;
                            }
                        });
                        varsegment.ioTag.map(function (varioTag) {
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
    var promise = getams_allioTag_allChannel(req.params.duk, req.params.key);
    promise.then(function (result) {
        res.render("con_motor", { alldata: result });
    });
});


router.post('/add/:componentCode/:templateName', function (req, res) {
    var valueInfo = new Object();
    valueInfo.templateName = req.params.templateName;
    valueInfo.componentCode = req.params.componentCode;
    valueInfo.seg = JSON.parse(req.body.seg);
    valueInfo.zdb = JSON.parse(req.body.zdb);
    mongoHelp.updGetBitsegaddzdb(valueInfo, function (result) {
        res.send(result);
    });
});

router.post('/look/:componentCode/:templateName/:objId', function (req, res) {
    var valueInfo = new Object();
    valueInfo.templateName = req.params.templateName;
    valueInfo.componentCode = req.params.componentCode;
    valueInfo.objId = req.params.objId;
    var promise = getams_oneSegment(req.params.objId, req.params.templateName, req.params.componentCode);
    promise.then(function (result) {
        res.send(result);
    });
});
router.post('/upd/:componentCode/:templateName/:objId', function (req, res) {
    var valueInfo = new Object();
    valueInfo.templateName = req.params.templateName;
    valueInfo.componentCode = req.params.componentCode;
    valueInfo.objId = req.params.objId;
    var promise = getams_oneSegment(req.params.objId, req.params.templateName, req.params.componentCode);
    promise.then(function (result) {
        res.send(result);
    });
});

router.get('/console/:id/:value', function (req, res) {
    redis.pub_console_q(req.params.id, req.params.value).then(function (data) {
        console.log(data);
        res.send(data);
    });
});

router.get('/monitor/test/:uid', function (req, res) {
    test_for_monitor_q(req.params.uid).then(function (data) {
        res.send(data);
    });
})

router.get('/monitor/:uid/:vname/:tree_uuid', function (req, res) {
    add_to_monitor_q(req.params.uid, req.params.vname, req.params.tree_uuid).then(function (data) {
        res.send(data);
    });
});

router.get('/monitor/:uid/:vname/:tree_uuid', function (req, res) {
    add_to_monitor_q(req.params.uid, req.params.vname, req.params.tree_uuid).then(function (data) {
        res.send(data);
    });
});

router.get('/monitor/:vname/:id/', function (req, res) {
    add_to_tree_q(req.params.vname, req.params.id).then(function (data) {
        res.send(data);
    });
});

router.put('/cons_data/:id/:tag_index/:seg_index', function (req, res) {
    update_cons_q(req.params.id, req.params.tag_index, req.params.seg_index, req.body).
        then(function (data) {
            res.send(data);
        })

});

router.delete('/cons_data/:id/:tag_index/:seg_index/:name', function (req, res) {
    del_cons_q(req.params.id, req.params.tag_index, req.params.seg_index, req.params.name).
        then(function (data) {
            res.send(data);
        });

});

router.post('/tree/:tree_name/:menu_name/:uid/', function (req, res) {
    add_tree_q(req.params.tree_name, req.params.menu_name, req.params.uid).
        then(function (data) {
            res.send(data);
        });

});

router.post('/tree/menu/:tree_id/:tree_name/:menu_name/:uid', function (req, res) {
    add_menuto_tree_q(req.params.tree_id, req.params.tree_name, req.params.menu_name, req.params.uid).
        then(function (data) {
            res.send(data);
        });

});

router.put('/tree/menu/:tree_id/:uid', function (req, res) {
    apply_tree_q(req.params.tree_id, req.params.uid).
        then(function (data) {
            res.send(data);
        });

});

router.put('/tree/name/:tree_id/:tree_name/:uid', function (req, res) {
    update_tree_name_q(req.params.tree_id, req.params.tree_name, req.params.uid).
        then(function (data) {
            res.send(data);
        });

});

router.put('/tree/menu/name/:oid/:menu_name/:uid', function (req, res) {
    update_menu_name_q(req.params.oid, req.params.menu_name, req.params.uid).
        then(function (data) {
            res.send(data);
        });

});

router.delete('/tree/:tree_id/:uid', function (req, res) {
    delete_tree_q(req.params.tree_id, req.params.uid).
        then(function (data) {
            res.send(data);
        });

});

router.delete('/menu/:oid', function (req, res) {
    delete_menu_q(req.params.oid).
        then(function (data) {
            res.send(data);
        });

});
// add_cons_q = function (_id, templateName, tag_index, update, tree_oid,
router.post('/cons/:id/:tag_index/:tree_oid', function (req, res) {
    add_cons_q(req.params.id, req.params.tag_index, req.body, req.params.tree_oid).then(
        function (result) {
            res.send(result);
        }
    )
});

router.get('/menu/cons/:templateName/:uid/:tree_id', function (req, res) {
    get_menu_var_q(req.params.tree_id, req.params.uid).then(function (data) {
        get_segments_q(req.params.templateName, data).then(
            function (result) {
                res.send(result);
            }
        )
    })
});

router.get('/tree/menus/:uid', function (req, res) {
    get_user_tree_q(req.params.uid).then(function (data) {
        res.send(data);
    })
});


module.exports = router;