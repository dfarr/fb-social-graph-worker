
module.exports = {

    name: 'user.friend',

    validate: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: false }
    },

    handlers: [

        {
            name: 'user.friend.connect',
            consumer: function(user, data) {
                
                var session = graph.session();

                session
                    .run('MERGE (u:User { uuid: {user}.id }) SET u.name = {user}.name MERGE (f:User { uuid: {data}.id }) SET f.name = {data}.name CREATE UNIQUE (u)-[:Friend]-(f) RETURN u,f', { user: user, data: data })

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
