
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver(process.env.NEO4J_HOST, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS));


module.exports = {

    name: 'user.match',
    consume: function(args, done) {

        var session = driver.session();

        session
            .run('MATCH (u:USER { uuid: {user} }) MATCH (u)-[:Match { uuid: {topic} }]->(f) RETURN f', { user: args.data.user, topic: args.data.topic })

            .catch(function(err) {
                done({ code: 500 });
            })

            .then(function(result) {

                var match = result.records.map(function(f) {
                    return f.get('f').properties;
                });

                done(null, match);

                session.close();

            });
    }

};
