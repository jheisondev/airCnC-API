import Sequelize, { Model } from 'sequelize';

class Spot extends Model {
  static init(sequelize) {
    super.init(
      {
        company: Sequelize.STRING,
        price: Sequelize.NUMBER,
        techs: Sequelize.ARRAY(Sequelize.STRING),
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'id_user' });
    this.belongsTo(models.File, { foreignKey: 'id_thumbnail' });
  }
}

export default Spot;
