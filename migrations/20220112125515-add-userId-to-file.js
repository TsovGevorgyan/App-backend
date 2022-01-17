'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Files', 'userId',{
            type: Sequelize.INTEGER,
            references: {model: 'Users'}
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Files', 'userId');
    }
};