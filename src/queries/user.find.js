
module.exports = {

    name: 'user.find',
    consume: function(args, done) {

        var session = graph.session();

        var page = parseInt(args.data.page) || 0;

        session
            .run('MATCH (u:USER) RETURN u SKIP {page}*8 LIMIT 8', { page: page })

            .catch(function(err) {
                console.log(err);
                done({ code: 500 });
            })

            .then(function(result) {

                var user = result.records.map(function(u) {
                    return u.get('u').properties;
                });

                done(null, user);

                session.close();

            });
    }

};
