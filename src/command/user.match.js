
module.exports = {

    name: 'user.match',

    opts: { noAck: true },

    handlers: [

        {
            name: 'user.match.connect',
            consume: function(msg) {

                var args = msg.content;
        
                var session = graph.session();

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
