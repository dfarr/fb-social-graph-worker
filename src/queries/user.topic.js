
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver(process.env.NEO4J_HOST, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS));


module.exports = {

    name: 'user.topic',
    consume: function(msg, arg, done) {

        var session = driver.session();

        session
            .run('MATCH (u:USER { uuid: {user} }) MATCH (u)-[t:Match]->() RETURN t', { user: arg.data.user })

            .catch(function(err) {
                done({ code: 500 });
            })

            .then(function(result) {

                var topic = result.records.map(function(t) {
                    return t.get('t').properties;
                });

                done(null, topic);

                session.close();

            });
    }

};
