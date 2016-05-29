
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver(process.env.NEO4J_HOST, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS));

var session = driver.session();


module.exports = function(user, data, done) {

    session
        .run('MERGE (u:USER { uuid: {user}, name: {name} }) RETURN u', { user: data.user, name: data.name })

        .catch(function(err) {
            done({ code: 500 });
        })

        .then(function(result) {

            var user = result.records[0].get('u').properties;

            done(null, { uuid: user.uuid, name: user.name });

        });

};
