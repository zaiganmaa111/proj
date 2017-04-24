var redis = require("redis");
var Q = require('q');



var redisHelp = {
    pub_console_q: function (id, value,callback) {
         var deffered = Q.defer();
        this.redis_init(function(console_pub){
            var flag = console_pub.publish("emerson_console", JSON.stringify({ id: id, value: value }));
            deffered.resolve(flag);
        })        
        return deffered.promise.nodeify(callback);
    },
    redis_init: function (action) {
        var console = redis.createClient(19000, "hao.oudot.cn");
        
        var flag = action(console);
        console.quit();
        return flag;
    }
}

module.exports = redisHelp
