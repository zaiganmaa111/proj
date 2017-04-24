/*mongodb����ģ����װ����*/
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://oudot.vicp.io:12307/mina_demo';
var mongoInit = function (collectName, collectAction) {
	MongoClient.connect(url, function (err, db) {
		//assert.equal(null, err);
		// db.collection(collectName, function(err,col)
		// {
		// 	col.update()
		// })
		console.log("Connected correctly to server.");
		db.collection(collectName, collectAction);
		db.close();
	});
}

var mongoHelp = {
	myurl: url,
	inczdb : function(valueInfo){
		var result = new Object();
		mongoInit("DATA_DICTIONARY", function (err, collection) {
			console.log("in");
			collection.insertOne(valueInfo.zdb, function (err, doc) {
				doc.insert
			})
		});
	},
	updGetBitsegaddzdb:   function (valueInfo, act) {
		var result = new Object();
		mongoInit("AMS_TAGS_INFO", function (err, collection) {
			collection.findOneAndUpdate({
					"tags.templateName" : valueInfo.templateName,
					"tags.componentCode" :valueInfo.componentCode
				}, {
					$push: {
						'tags.0.segment': {
							"_id": new ObjectId(),
							"valType": valueInfo.seg.valType,
							"collectCode": valueInfo.seg.collectCode,
							"parameterId": valueInfo.seg.parameterId,
							"isTime": valueInfo.seg.isTime,
							"access_type": valueInfo.seg.access_type,
							"name": valueInfo.seg.name,
							"ioTag":[{
									"desc": valueInfo.seg.ioTag[0].desc,
									"alias": valueInfo.seg.ioTag[0].alias,
									"coefficient":valueInfo.seg.ioTag[0].coefficient,
									"strategy": valueInfo.seg.ioTag[0].strategy,
									"index": 0,
									"length": 16
								}
							]
						}
					}
				}
				, function (err, r) {
					result.message = "updated";
					if(!err){
						mongoInit("DATA_DICTIONARY", function (err, collection) {
							console.log("in");
							collection.insertOne(valueInfo.zdb, function (err, doc) {
								doc.insert
							})
						});
					}
					act(result);
				});
		});

	},

	mongoInit: mongoInit,

	mongoFindAll: function (collectName, act) {
		var result = new Object();

		mongoInit(collectName, function (err, collection) {
			console.log("in");
			// Attempt to read (should fail due to the server not being a primary);
			collection.find().toArray(function (err, doc) {
				//assert.equal(err, null);
				//assert.equal(doc.length, 1);
				if (doc != null) {
					console.log("in true");
					console.dir(doc);
					result.data = doc;
					result.message = "founded"
				} else {
					console.log("in else");
					result.message = "nothing was found";
				}

				act(result);
			})
		});
	},

	mongoAddOne: function (collectName, value, act) {
		var result = new Object();

		mongoInit(collectName, function (err, collection) {
			console.log("in");
			collection.insertOne(value, function (err, doc) {
				//assert.equal(err, null);
				//assert.equal(doc.insertedCount, 1);
				doc.insert

				result.message = "inserted";
				result.insertedId = doc.insertedId;

				act(result);
			})
		});
		//db.close();
	},

	mongoPutOne: function (collectName, value, act) {
		var result = new Object();

		mongoInit(collectName, function (err, collection) {
			console.log("in");
			collection.findOneAndUpdate({_id: value._id}
					, {$set: value.body}
					, function (err, r) {
						//assert.equal(null, err);
						//assert.equal(1, r.lastErrorObject.n);
						result.message = "updated";
						act(result);
					});

		});
	},

	mongoDeleteOne: function (collectName, value, act) {
		var result = new Object();

		mongoInit(collectName, function (err, collection) {
			console.log("in");
			collection.findOneAndDelete({_id: value._id}
					, function (err, r) {
						//assert.equal(null, err);
						//assert.equal(1, r.lastErrorObject.n);

						result.message = "deleted";
						act(result);
					});

		});
	}
}


module.exports = mongoHelp;