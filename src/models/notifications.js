module.exports = (sequelize, DataTypes) => {
  const Notifications = sequelize.define('Notifications', {
    status: DataTypes.ENUM('read, unread'),
    content: DataTypes.STRING,
    receiverId: DataTypes.STRING,
    requestId: DataTypes.STRING,
    receiverEmail: DataTypes.STRING,
    link: DataTypes.STRING
  }, {});
  Notifications.associate = (models) => {
    Notifications.belongsTo(models.User, {
      foreignKey: 'receiverId',
      as: 'user',
      onDelete: 'CASCADE'
    });
  };
  return Notifications;
};
