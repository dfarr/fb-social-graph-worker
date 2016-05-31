
var colors = require('colors');
var glob = require('glob');

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

        var utils = require('./src/utils');


        ///////////////////////////////////////////////////////////////////////////////
        // Queries
        ///////////////////////////////////////////////////////////////////////////////

        utils.q(mq, channel, __dirname + '/src/queries/*.js', function(err, res, msg) {

            var headers = {};

            if(err) {
                headers.code = err.code || 500;
            }

            channel.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(err || res)), { headers: headers });

            channel.ack(msg);

        });


        ///////////////////////////////////////////////////////////////////////////////
        // Command
        ///////////////////////////////////////////////////////////////////////////////

        utils.c(mq, channel, __dirname + '/src/command/*.js', function(err, res, msg) {

            if(err) {

                // TODO: understand when to requeue failed messages

                console.log(err);
                return channel.nack(msg, false, false);
            }

            channel.ack(msg);

        });

    });

});
