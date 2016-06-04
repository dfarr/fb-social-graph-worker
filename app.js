
var glob = require('glob');
var path = require('path');
var async = require('async');
var colors = require('colors');


///////////////////////////////////////////////////////////////////////////////
// Bootstrap
///////////////////////////////////////////////////////////////////////////////

async.series([

    ///////////////////////////////////////////////////////////////////////////////
    // AMQP
    ///////////////////////////////////////////////////////////////////////////////

    function(done) {

        var amqp = require('amqplib/callback_api');

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
    // Neo4j
    ///////////////////////////////////////////////////////////////////////////////

    function(done) {

        var neo4j = require('neo4j-driver').v1;

        var graph = neo4j.driver(process.env.NEO4J_HOST, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS));

        require('./src/_init.js')(graph, function(err) {

            if(err) {
                console.log('✖ '.bold.red + 'failed to connect to neo4j');
                done(err);
            }

            global.graph = graph;

            console.log('✓ '.bold.green + 'connected to neo4j');
            done();
        });
    },


    ///////////////////////////////////////////////////////////////////////////////
    // Postgres
    ///////////////////////////////////////////////////////////////////////////////

    function(done) {

        var Sequelize = require('sequelize');

        var sequelize = new Sequelize(process.env.POSTGRES);

        glob('./src/models/*.js', function(err, file) {

            file = file || [];

            file
                .map(f => path.join(__dirname, f))
                .forEach(f => sequelize.import(f));

            global.db = sequelize;

            sequelize.sync().then(function() {

                console.log('✓ '.bold.green + 'connected to postgres');
                done();

            }).catch(function(err) {

                console.log('✖ '.bold.red + 'failed to connect to postgres');
                done(err);

            });
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
