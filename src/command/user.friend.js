
module.exports = {

    name: 'user.friend',

    validate: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: false }
    },

    handlers: [

        {
            name: 'user.friend',
            consumer: function(user, data, done) {
                
                var session = graph.session();

                session
                    .run('MATCH (u:User { uuid: {user}.id }) MATCH (f:User { uuid: {data}.id }) CREATE UNIQUE (u)-[:Friend]-(f)', { user: user, data: data })

                    .catch(done)

                    .then(function(res) {
                        done();
                        session.close();
                    });

            }
        }

    ]

};
