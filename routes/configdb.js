//更具型号去查询 他的线路图配置
var getams_configureLineByTransformerKey = function (transformerKey, callback) {
	var deffered = Q.defer();
	mongoHelp.mongoInit("MODEL_LINE_CONFIGURATION", function (err, collection) {
		collection.find({"transformerKey": transformerKey}).toArray(function (err, doc) {
			//assert.equal(err, null);
			var result = new Object();
			if (doc != null) {
				result.data = doc[0];
				result.message = "founded"
			} else {
				result.data = null;
				result.message = "nothing was found";
			}
			deffered.resolve(result);
		})
	});
	return deffered.promise.nodeify(callback);
}
//找到全部的参数列表
var getams_iotagsInofo = function (callback) {
	var deffered = Q.defer();
	mongoHelp.mongoFindAll("AMS_TAGS_INFO", function (result) {
		deffered.resolve(result);
	});
	return deffered.promise.nodeify(callback);
}
//找到全部的型号
var getams_TEST = function (callback) {
	var deffered = Q.defer();
	mongoHelp.mongoFindAll("test", function (result) {
		deffered.resolve(result);
	});
	return deffered.promise.nodeify(callback);
}

var test_iotags_getAllByTransformerKey = function (transformerKey) {
	var infos_iotags = getams_iotagsInofo();
	var infos_line_configuration = getams_configureLineByTransformerKey(transformerKey);
	return Q.all([infos_line_configuration, infos_iotags]).then(function (pdata) {
		var arr2 = [];
		for (var i = 0; i < pdata[1].data[0].tags.length; i++) {
			var tt2 = {};
			if (pdata[1].data[0].tags[i].dataType == "collect") {
				for (var j = 0; j < pdata[1].data[0].tags[i].segment.length; j++) {
					var id = pdata[1].data[0].tags[i].segment[j]._id;
					for (var k = 0; k < pdata[0].data.parameterIds.length; k++) {
						var kid = pdata[0].data.parameterIds[k]._id;
						if ((id + "") != (kid + "")) {
							var parameterId = pdata[1].data[0].tags[i].segment[j].parameterId;
							var desc = "";
							for (var c = 0; c < pdata[1].data[0].tags[i].segment[j].ioTag.length; c++) {
								if (pdata[1].data[0].tags[i].segment[j].ioTag.length == 1) {
									desc += pdata[1].data[0].tags[i].segment[j].ioTag[c].desc;
								} else {
									desc += "[" + c + "]" + pdata[1].data[0].tags[i].segment[j].ioTag[c].desc;
								}
							}
							var tt2 = {};
							tt2["_id"] = id;
							tt2["parameterId"] = parameterId
							tt2["desc"] = desc;
							arr2.push(tt2);
						}
					}
				}
			}
		}

		console.log(arr2);
		return {
			cs: arr2,
			lc: pdata[0].data
		}
	});
}


//页面初始化，拿到全部的参数和 型号列表
var test_iotags_getAll_q = function () {
	var infos_test = getams_TEST();
	var infos_iotags = getams_iotagsInofo();
	return Q.all([infos_test, infos_iotags]).then(function (pdata) {
		var arr = [];
		for (var i = 0; i < pdata[0].data.length; i++) {
			var tt = {};
			var id = pdata[0].data[i]._id;
			var name = pdata[0].data[i].name;
			tt["_id"] = id;
			tt["name"] = name;
			arr.push(tt);
		}

		var arr2 = [];
		for (var i = 0; i < pdata[1].data[0].tags.length; i++) {
			var tt2 = {};
			if (pdata[1].data[0].tags[i].dataType == "collect") {
				for (var j = 0; j < pdata[1].data[0].tags[i].segment.length; j++) {
					var id = pdata[1].data[0].tags[i].segment[j]._id;
					var parameterId = pdata[1].data[0].tags[i].segment[j].parameterId;
					var desc = "";
					for (var c = 0; c < pdata[1].data[0].tags[i].segment[j].ioTag.length; c++) {
						if (pdata[1].data[0].tags[i].segment[j].ioTag.length == 1) {
							desc += pdata[1].data[0].tags[i].segment[j].ioTag[c].desc;
						} else {
							desc += "[" + c + "]" + pdata[1].data[0].tags[i].segment[j].ioTag[c].desc;
						}
					}
					var tt2 = {};
					tt2["_id"] = id;
					tt2["parameterId"] = parameterId
					tt2["desc"] = desc;
					arr2.push(tt2);
				}
			}
		}
		return {
			cs: arr2,
			xh: arr
		};
	});
}

router.get('/', function (req, res) {
	var promise = test_iotags_getAll_q();
	promise.then(function (result) {
		res.render("con_homePage", {transformer: result});
	});
});

router.get('/cl/:transformerKey', function (req, res) {
	var promise = test_iotags_getAllByTransformerKey(req.params.transformerKey);
	promise.then(function (result) {
		res.render("con_homePage", {transformer: result})
	});
});

module.exports = {
	router: router,
	getams_configureLineByTransformerKey: getams_configureLineByTransformerKey
};
