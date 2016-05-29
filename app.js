
var glob = require('glob');
var path = require('path');
var uuid = require('node-uuid');
var merge = require('merge');
var async = require('async');
var colors = require('colors');

var amqp = require('amqplib/callback_api');


///////////////////////////////////////////////////////////////////////////////
// API
///////////////////////////////////////////////////////////////////////////////

var api = {
    default: function(data, done) {
        done({code: 404, text: 'Not Found'});
    }
};

glob(__dirname + '/src/*.js', function(err, files) {
    if(!err) {
        files.forEach(function(file) {
            console.log('✓ '.bold.green + path.relative(process.cwd(), file));
            api[path.basename(file, '.js')] = require(file);
        });
    }
});



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

        channel.assertQueue('user', { durable: true });

        // channel.prefetch(1);

        channel.consume('user', function(msg) {

            var args = JSON.parse(msg.content.toString());

            var call = api[args.name] ? args.name : 'default';

            api[call](args.data, function(err, res) {

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
