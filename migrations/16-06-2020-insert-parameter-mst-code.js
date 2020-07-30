'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("INSERT INTO `tcyb15yqor59zhje`.`mst_codes`"+
    	"(`code`, `name`, `createdAt`, `updatedAt`, `categoryCodeId`) VALUES ('PTSWTG', "+
    	"'Waiting', '2020-05-16 08:40:57', '2020-05-16 08:40:57', 'PTS'), ('PTSVRF', "+
    	"'Verification', '2020-05-16 08:40:57', '2020-05-16 08:40:57', 'PTS'), ('PTSVRD', "+
    	"'Verified', '2020-05-16 08:42:31', '2020-05-16 08:42:31', 'PTS'), ('PTTDP', 'DP', "+
    	"'2020-05-16 08:43:19', '2020-05-16 08:43:19', 'PTT'), ('PTTRPT', 'Repayment', "+
    	"'2020-05-16 08:43:50', '2020-05-16 08:43:53', 'PTT'), ('BKSWTG', 'Waiting',"+
    	" '2020-05-16 09:51:11', '2020-05-16 09:51:11', 'BKS'), ('BKSORG', 'On Running',"+
    	" '2020-05-16 09:57:37', '2020-05-16 09:57:37', 'BKS'), ('BKSDON', 'Done',"+
    	" '2020-05-16 09:57:37', '2020-05-16 09:57:37', 'BKS');");
  }
};