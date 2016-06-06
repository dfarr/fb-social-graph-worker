
module.exports = {

    name: 'user.create',

    validate: [],

    handlers: [

        {
            name: 'user.create',
            consumer: function(user, data, done) {
                
                var session = graph.session();

                session
                    .run('MERGE (u:User { uuid: {user}.id }) SET u.name = {user}.name', { user: user })

                    .catch(done)

                    .then(function(res) {

                        var fx = data.map(data => ({ name: 'user.friend', data: data }));

                        done(null, fx);

                        session.close();
                    
                    });

            }
        }

    ]

};
