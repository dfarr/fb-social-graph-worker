
module.exports = {

    name: 'user.find',

    validate: {
        page: { type: 'number', required: false }
    },

    consumer: function(user, data, done) {

        var session = graph.session();

        data.page = data.page || 0;

        session
            .run('MATCH (u:User) RETURN u SKIP {data}.page * 8 LIMIT 8', { user: user, data: data })

            .catch(function(err) {
                console.log(err);
                done({ code: 500 });
            })

            .then(function(res) {

                var uuid = res.records.map(u => u.get('u').properties.uuid);

                done(null, uuid);

                session.close();

            });
    }

};
