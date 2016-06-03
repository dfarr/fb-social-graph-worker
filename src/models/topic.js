
///////////////////////////////////////////////////////////////////////////////
// Topic Model
///////////////////////////////////////////////////////////////////////////////

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('topic', {

        uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, unique: true },

        name: Sequelize.STRING

    });

};
