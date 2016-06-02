
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver(process.env.NEO4J_HOST, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS));


module.exports = {

    name: 'user.match',

    opts: { noAck: true },

    handlers: [

        {
            name: 'user.match.connect',
            consume: function(msg) {

                var args = msg.content;
        
                var session = driver.session();

                session
                    .run('MERGE (u:USER { uuid: {user} }) MERGE (m:USER { uuid: {uuid} }) CREATE UNIQUE (u)-[t:Match { uuid: {topic} }]->(m) RETURN u,t', { user: args.data.user, uuid: args.data.uuid, topic: args.data.topic })

                    .catch(function(err) {
                        console.log(err);
                    })

                    .then(function(result) {
                        console.log(result.records[0].get('u').properties, result.records[0].get('t').properties);
                        session.close();
                    });

            }
        }

    ]

};
