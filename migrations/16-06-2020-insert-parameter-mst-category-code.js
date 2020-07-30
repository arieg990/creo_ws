'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("INSERT INTO `tcyb15yqor59zhje`.`mst_category_codes`"+
      "(`categoryCode`, `name`, `createdAt`, `updatedAt`) VALUES ('PTS', 'Payment Status', '2020-05-16 08:29:26',"+
      " '2020-05-16 08:29:26'), ('PTT', 'Payment Type', '2020-05-16 08:29:26', '2020-05-16 08:29:26'),"+
      " ('BKS', 'Booking Status', '2020-05-16 09:49:24', '2020-05-16 09:49:24');");
  }
};