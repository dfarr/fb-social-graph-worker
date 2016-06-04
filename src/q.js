
var validator = require('validate');

var ch = mq.createChannel();


//////////////////////////////////////////////////////////////////////////////
// Query
///////////////////////////////////////////////////////////////////////////////

module.exports = function(query) {

    ch.assertQueue('q.' + query.name);

    ch.consume('q.' + query.name, function(msg) {

        var args = JSON.parse(msg.content.toString());

        var user = args.user;

        var data = args.data;

        var errs = validator(query.validate).validate(data);

        if(errs.length) {

            ch.sendToQueue(msg.properties.replyTo, new Buffer('{"code":400,"text":"Bad Requst"}'), { headers: { code: 400 } });

            return;
        }

        query.consumer(user, data, function(err, res) {

            var headers = {};

            headers.code = err ? err.code : 200;

            ch.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(err || res)), { headers: headers });

            ch.ack(msg);

        });

    });

};

