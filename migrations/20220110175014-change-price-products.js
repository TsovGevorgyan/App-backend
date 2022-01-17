'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Products', 'price', {
      type: 'INTEGER USING CAST("price" as INTEGER)',
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Products', 'price', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
