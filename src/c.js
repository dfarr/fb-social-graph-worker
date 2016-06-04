
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

            var errs = validator(command.validate).validate(data);

            if(!errs.length) {
                h.consumer(user, data);
            }

            ch.ack(msg);
        };

        ch.consume(name, consumer);

    });

};
