
var glob = require('glob');
var async = require('async');
var colors = require('colors');

var amqp = require('amqplib/callback_api');


async.series([

    ///////////////////////////////////////////////////////////////////////////////
    // AMQP
    ///////////////////////////////////////////////////////////////////////////////

    function(done) {

        amqp.connect(process.env.AMQP, function(err, mq) {

            if(err) {
                console.log('✖ '.bold.red + 'failed to connect to rabbitmq');
                done(err);
            }

            global.mq = mq;

            console.log('✓ '.bold.green + 'connected to rabbitmq');
            done();
        });
    },


    ///////////////////////////////////////////////////////////////////////////////
    // Queries
    ///////////////////////////////////////////////////////////////////////////////

    function(done) {

        var q = require('./src/q');

        glob('./src/queries/*.js', function(err, file) {

            file = file || [];

            file.forEach(f => q(require(f)));

            console.log('✓ '.bold.green + 'ready to handle queries');
            done();
        });
    },


    ///////////////////////////////////////////////////////////////////////////////
    // Command
    ///////////////////////////////////////////////////////////////////////////////

    function(done) {

        var c = require('./src/c');

        glob('./src/command/*.js', function(err, file) {

            file = file || [];

            file.forEach(f => c(require(f)));

            console.log('✓ '.bold.green + 'ready to handle command');
            done();
        });
    }

], function(err) {

    if(err) {
        console.log('✖ '.bold.red + 'failed to bootstrap worker');
        console.log(err);

        process.exit(1);
    }

    console.log('✓ '.bold.green + 'successfully bootstraped worker');

});
