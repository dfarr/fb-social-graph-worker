
module.exports = {

    name: 'user.choose',

    validate: {
        user: { type: 'string', required: true },
        topic: { type: 'string', required: true }
    },

    handlers: [

        {
            name: 'user.choose',
            consumer: function(user, data, done) {
        
                var session = graph.session();

                session
                    .run('MATCH (u:User { uuid: {user}.id }) MATCH (m:User { uuid: {data}.user }) CREATE UNIQUE (u)-[:Match { uuid: {data}.topic }]->(m)', { user: user, data: data })

                    .catch(done)

                    .then(function(res) {
                        done();
                        session.close();
                    });

            }
        }

    ]

};
