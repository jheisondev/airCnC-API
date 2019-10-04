import Sequelize from 'sequelize';
// import models
import User from '../app/models/User';
import File from '../app/models/File';
import Spot from '../app/models/Spot';

import databaseConfig from '../config/database';

const models = [User, File, Spot];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
