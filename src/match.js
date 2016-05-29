
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver(process.env.NEO4J_HOST, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS));

var session = driver.session();


module.exports = function(user, data, done) {

    session
        .run('MATCH (u:USER { uuid: {user} }) MATCH (m:USER { uuid: {uuid} }) CREATE UNIQUE (u)-[t:Match { uuid: {topic} }]->(m) RETURN u,t', { user: data.user, uuid: data.uuid, topic: data.topic })

        .catch(function(err) {
            done({ code: 500 });
        })

        .then(function(result) {

            var user = result.records[0].get('u').properties;
            var topic = result.records[0].get('t').properties;

            done(null, { user: user.uuid, topic: topic.uuid });

        });

};
