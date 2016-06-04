
module.exports = {

    name: 'user.topic',

    validate: {},

    consumer: function(user, data, done) {

        var session = graph.session();

        session
            .run('MATCH (u:User { uuid: {user}.id }) MATCH (u)-[t:Match]->() RETURN t', { user: user, data: data })

            .catch(function(err) {
                done({ code: 500 });
            })

            .then(function(res) {

                var uuid = res.records.map(t => t.get('t').properties.uuid);

                done(null, uuid);

                session.close();

            });
    }

};
