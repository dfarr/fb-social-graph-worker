
var glob = require('glob');

module.exports = {

    ///////////////////////////////////////////////////////////////////////////////
    // Queries
    ///////////////////////////////////////////////////////////////////////////////

    q: function(mq, channel, pattern, done) {

        glob(pattern, function(err, file) {

            file = file || [];

            file.forEach(function(f) {

                var q = require(f);

                channel.assertQueue('q.' + q.name, { durable: false });

                channel.consume('q.' + q.name, function(msg) {

                    // TODO: parse in try/catch

                    q.consume(msg, JSON.parse(msg.content.toString()), function(err, res) {
                        done(err, res, msg);
                    });

                });

            });
        });

    },


    ///////////////////////////////////////////////////////////////////////////////
    // Command
    ///////////////////////////////////////////////////////////////////////////////

    c: function(mq, channel, pattern, done) {

        glob(pattern, function(err, file) {

            file = file || [];

            file.forEach(function(f) {

                var c = require(f);

                channel.assertExchange('event', 'direct');

                channel.assertExchange(c.name, 'direct');

                channel.assertExchange(c.name + '.handlers', 'fanout');

                channel.bindExchange(c.name, 'event', c.name);

                // forward to handlers
                channel.assertQueue(c.name, {}, function(err, queue) {

                    channel.bindQueue(queue.queue, c.name, c.name);

                    channel.consume(queue.queue, function(msg) {

                        channel.publish(c.name + '.handlers', '', msg.content);

                        channel.sendToQueue(msg.properties.replyTo, new Buffer('{"ok":true}'));

                        channel.ack(msg);

                    });

                });

                // declare handlers
                c.handlers.forEach(function(h) {

                    channel.assertQueue(h.name, {}, function(err, queue) {

                        channel.bindQueue(queue.queue, c.name + '.handlers');

                        channel.consume(queue.queue, function(msg) {

                            // TODO: parse in try/catch

                            h.consume(msg, JSON.parse(msg.content.toString()), function(err, res) {
                                done(err, res, msg);
                            });

                        });

                    });

                });

            });

        });

    }

};
