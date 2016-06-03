
//////////////////////////////////////////////////////////////////////////////
// Initialize Neo4J
///////////////////////////////////////////////////////////////////////////////

module.exports = function(graph, done) {

    var session = graph.session();

    var tx = session.beginTransaction();

    tx.run('CREATE CONSTRAINT ON (u:User) ASSERT u.uuid IS UNIQUE');
    tx.run('CREATE CONSTRAINT ON (t:Topic) ASSERT t.uuid IS UNIQUE');

    tx.commit()
      .catch(done)
      .then(function() {

        session.close(done);

      });

};
