
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver(process.env.NEO4J_HOST, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS));


module.exports = {

    name: 'user.friend',

    handlers: [

        {
            name: 'user.friend.match',
            consume: function(msg, arg, done) {
                
                var session = driver.session();

                session
                    .run('MERGE (u:USER { uuid: {user} }) MERGE (f:USER { uuid: {uuid} }) CREATE UNIQUE (u)-[:Friend]->(f) CREATE UNIQUE (f)-[:Friend]->(u) RETURN u,f', { user: arg.data.user, uuid: arg.data.uuid })

                    .catch(function(err) {
                        done(err);
                    })

                    .then(function(result) {
                        console.log(result.records[0].get('u').properties, result.records[0].get('f').properties);
                        session.close();
                        done();
                    });

            }
        }

    ]

};
