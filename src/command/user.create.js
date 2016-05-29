
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver(process.env.NEO4J_HOST, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS));


module.exports = [

    { 
        name: 'user.create',
        consume: function(msg, arg, channel) {
            channel.sendToQueue(msg.properties.replyTo, new Buffer('{"ok":true}'));
        }
    }

];
