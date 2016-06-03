
module.exports = {

    name: 'user.topic',
    consume: function(args, done) {

        var session = graph.session();

        session
            .run('MATCH (u:USER { uuid: {user} }) MATCH (u)-[t:Match]->() RETURN t', { user: args.data.user })

            .catch(function(err) {
                done({ code: 500 });
            })

            .then(function(result) {

                var topic = result.records.map(function(t) {
                    return t.get('t').properties;
                });

                done(null, topic);

                session.close();

            });
    }

};
