
var ch = mq.createChannel();


//////////////////////////////////////////////////////////////////////////////
// Query
///////////////////////////////////////////////////////////////////////////////

module.exports = function(query) {

    ch.assertQueue('q.' + query.name);

    ch.consume('q.' + query.name, function(msg) {

        msg.content = JSON.parse(msg.content.toString());

        query.consume(msg.content, function(err, res) {

            console.log('GOT IT', msg.properties.replyTo);

            var headers = {};

            headers.code = err ? err.code : 200;

            ch.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(err || res)), { headers: headers });

            ch.ack(msg);

        });

    });

};

