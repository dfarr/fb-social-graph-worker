
module.exports = {

    name: 'user.topics',

    validate: {},

    consumer: function(user, data, done) {

        var session = graph.session();

        session
            .run('MATCH (u:User { uuid: {user}.id }) MATCH (u)-[t1:Match]->() MATCH (u)<-[t2:Match]-() RETURN t1,t2', { user: user, data: data })

            .catch(function(err) {
                done({ code: 500 });
            })

            .then(function(res) {

                var t1 = res.records.map(t => t.get('t1').properties.uuid);
                var t2 = res.records.map(t => t.get('t2').properties.uuid);

                var uuid = t1.concat(t2).filter((item, index, self) => index === self.indexOf(item));

                done(null, uuid);

                session.close();

            });
    }

};
