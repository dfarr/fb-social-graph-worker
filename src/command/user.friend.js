
module.exports = {

    name: 'user.friend',

    opts: { noAck: true },

    handlers: [

        {
            name: 'user.friend.match',
            consume: function(msg) {

                var args = msg.content;
                
                var session = graph.session();

                session
                    .run('MERGE (u:USER { uuid: {id}, name: {name} }) MERGE (f:USER { uuid: {f_id}, name: {f_name} }) CREATE UNIQUE (u)-[:Friend]->(f) CREATE UNIQUE (f)-[:Friend]->(u) RETURN u,f', { id: args.user.id, name: args.user.name, f_id: args.data.id, f_name: args.data.name })

                    .catch(function(err) {
                        console.log(err);
                    })

                    .then(function(result) {
                        console.log(result.records[0].get('u').properties, result.records[0].get('f').properties);
                        session.close();
                    });

            }
        }

    ]

};
