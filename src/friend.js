
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver(process.env.NEO4J_HOST, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS));

var session = driver.session();


module.exports = function(user, data, done) {

    session
        .run('MATCH (u:USER { uuid: {user} }) MATCH (f:USER { uuid: {uuid} }) CREATE UNIQUE (u)-[:Friend]->(f) CREATE UNIQUE (f)-[:Friend]->(u) RETURN u', { user: data.user, uuid: data.uuid })

        .catch(function(err) {
            done({ code: 500 });
        })

        .then(function(result) {

            var user = result.records[0].get('u').properties;

            done(null, { user: user.uuid });

        });

};
