
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
            msg.content = JSON.parse(msg.content.toString());
            h.consume(msg);
        };

        ch.consume(name, consumer, h.opts);

    });

};
