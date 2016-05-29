
var glob = require('glob');
var path = require('path');
var uuid = require('node-uuid');
var merge = require('merge');
var async = require('async');
var colors = require('colors');

var amqp = require('amqplib/callback_api');



///////////////////////////////////////////////////////////////////////////////
// AMQP
///////////////////////////////////////////////////////////////////////////////

amqp.connect(process.env.AMQP, function(err, mq) {

    if(err) {
        console.log('✖ '.bold.red + 'failed to connect to rabbitmq');
        process.exit(1);
    }

    console.log('✓ '.bold.green + 'connected to rabbitmq');


    mq.createChannel(function(err, channel) {

        channel.assertExchange('event', 'direct');


        ///////////////////////////////////////////////////////////////////////////////
        // Queries
        ///////////////////////////////////////////////////////////////////////////////

        glob('./src/queries/*.js', function(err, file) {
            file = file || [];
            file.forEach(function(f) {

                var q = require(f);

                channel.assertQueue('q.' + q.name, { durable: true });

                channel.consume('q.' + q.name, function(msg) {
                    q.consume(msg, JSON.parse(msg.content.toString()), function(err, res) {

                        var headers = {};

                        if(err) {
                            headers.code = err.code || 500;
                        }

                        channel.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(err || res)), { headers: headers });

                        channel.ack(msg);

                    });
                });

            });
        });


        ///////////////////////////////////////////////////////////////////////////////
        // Command
        ///////////////////////////////////////////////////////////////////////////////

        glob('./src/command/*.js', function(err, file) {
            file = file || [];
            file.forEach(function(f) {

                var command = require(f);

                var pattern = /^.+\/([^\/]+).js$/.exec(f);

                command.forEach(function(c) {
                    channel.assertQueue('c.' + c.name, {}, function(err, queue) {
                        channel.bindQueue(queue.queue, 'event', 'c.' + pattern[1]);
                        channel.consume(queue.queue, function(msg) {
                            channel.ack(msg);
                            c.consume(msg, JSON.parse(msg.content.toString()), channel);
                        });
                    });
                });

            });
        });

    });

});
