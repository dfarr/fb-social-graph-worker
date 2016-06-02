
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver(process.env.NEO4J_HOST, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS));


module.exports = {

    name: 'user.find',
    consume: function(args, done) {

        var session = driver.session();

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
