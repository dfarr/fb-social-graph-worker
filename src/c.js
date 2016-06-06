
var validator = require('validate');

var ch = mq.createChannel();


///////////////////////////////////////////////////////////////////////////////
// Command
///////////////////////////////////////////////////////////////////////////////

module.exports = function(command) {

    ch.assertExchange('event', 'topic');

    command.handlers.forEach(function(h) {

        var name = 'c.' + h.name;

        ch.assertQueue(name);

        ch.bindQueue(name, 'event', command.name);

        var consumer = function(msg) {

            var args = JSON.parse(msg.content.toString());

            var user = args.user;

            var data = args.data;

            var errs = validator(command.validate).validate(data, { strip: false });

            if(errs.length) {
                return ch.ack(msg); // nack?
            }

            h.consumer(user, data, function(err, fx) {

                if(err) {
                    console.log(err); // nack??
                }

                (fx || []).map(fx => ({ name: fx.name, data: { user: user, data: fx.data } }))
                          .map(fx => ({ name: fx.name, data: new Buffer(JSON.stringify(fx.data)) }))
                          .forEach(fx => ch.publish('event', fx.name, fx.data));

                ch.ack(msg);
            });
        };

        ch.consume(name, consumer);

    });

};
