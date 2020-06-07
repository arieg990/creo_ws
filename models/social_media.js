'use strict';
module.exports = (sequelize, DataTypes) => {
  const socialMedia = sequelize.define('SocialMedia', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName:'social_media'
  });
  socialMedia.associate = function(models) {

    socialMedia.belongsTo(models.Code,{
      foreignKey: {
        name:'socialMediaCode',
        allowNull: false
      },
      as: "socialMediaType"
    });
  };
  return socialMedia;
};