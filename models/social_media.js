'use strict';
module.exports = (sequelize, DataTypes) => {
  const socialMedia = sequelize.define('SocialMedia', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
  }, {
    tableName:'social_media'
  });
  socialMedia.associate = function(models) {

    socialMedia.belongsTo(models.Code,{
      foreignKey: 'code',
    });
  };
  return socialMedia;
};