
module.exports = {

    name: 'user.match',
    consume: function(args, done) {

        var session = graph.session();

        session
            .run('MATCH (u:USER { uuid: {user} }) MATCH (u)-[:Match { uuid: {topic} }]->(f) RETURN f', { user: args.data.user, topic: args.data.topic })

            .catch(function(err) {
                done({ code: 500 });
            })

            .then(function(result) {

                var match = result.records.map(function(f) {
                    return f.get('f').properties;
                });

                done(null, match);

                session.close();

            });
    }

};
