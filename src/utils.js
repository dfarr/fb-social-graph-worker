
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

                channel.assertExchange('event', 'topic');

                c.handlers.forEach(function(h) {

                    var name = 'c.' + h.name;

                    channel.assertQueue(name);

                    channel.bindQueue(name, 'event', c.name);

                    channel.consume(name, function(msg) {

                        // TODO: parse in try/catch

                        h.consume(msg, JSON.parse(msg.content.toString()), function(err, res) {
                            done(err, res, msg);
                        });

                    });

                });

            });

        });

    }

};
