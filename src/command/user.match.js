
module.exports = {

    name: 'user.match',

    validate: {
        user: { type: 'string', required: true },
        topic: { type: 'string', required: true }
    },

    handlers: [

        {
            name: 'user.match.connect',
            consumer: function(user, data) {
        
                var session = graph.session();

                session
                    .run('MERGE (u:User { uuid: {user}.id }) MERGE (m:User { uuid: {data}.user }) CREATE UNIQUE (u)-[t:Match { uuid: {data}.topic }]->(m) RETURN u,t', { user: user, data: data })

                    .catch(function(err) {
                        console.log(err);
                    })

                    .then(function(result) {
                        session.close();
                    });

            }
        }

    ]

};
