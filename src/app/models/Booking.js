import Sequelize, { Model } from 'sequelize';

class Booking extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.STRING,
        approved: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'id_user' });
    this.belongsTo(models.Spot, { foreignKey: 'id_spot' });
  }
}

export default Booking;
