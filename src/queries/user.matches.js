
module.exports = {

    name: 'user.matches',

    validate: {
        topic: { type: 'string', required: true }
    },

    consumer: function(user, data, done) {

        var session = graph.session();

        session
            .run('MATCH (u:User { uuid: {user}.id }) MATCH (u)-[:Match { uuid: {data}.topic }]->(m) MATCH (u)<-[:Match { uuid: {data}.topic }]-(m) RETURN m', { user: user, data: data })

            .catch(function(err) {
                done({ code: 500 });
            })

            .then(function(res) {

                var uuid = res.records.map(m => m.get('m').properties.uuid);

                done(null, uuid);

                session.close();

            });
    }

};
