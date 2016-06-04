
module.exports = {

    name: 'user.match',

    validate: {
        topic: { type: 'string', required: true }
    },

    consumer: function(user, data, done) {

        var session = graph.session();

        session
            .run('MATCH (u:User { uuid: {user}.id }) MATCH (u)-[:Match { uuid: {data}.topic }]->(f) RETURN f', { user: user, data: data })

            .catch(function(err) {
                done({ code: 500 });
            })

            .then(function(res) {

                var uuid = res.records.map(f => f.get('f').properties.uuid);

                done(null, uuid);

                session.close();

            });
    }

};
