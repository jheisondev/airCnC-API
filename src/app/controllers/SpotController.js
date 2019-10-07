import Sequelize from 'sequelize';
import File from '../models/File';
import User from '../models/User';
import Spot from '../models/Spot';

class SpotController {
  async index(req, res) {
    const { Op } = Sequelize;
    const { tech } = req.query;
    const spots = await Spot.findAll({
      where: {
        techs: { [Op.contains]: [tech] },
      },
      include: [
        {
          model: File,
          attributes: ['id', 'name', 'path'],
        },
      ],
    });

    return res.json(spots);
  }

  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const { company, price, techs } = req.body;
    const { userId } = req;

    try {
      const userExists = await User.findByPk(userId);
      if (!userExists) {
        return res.status(400).json({ erro: 'Usúario não esta logado!' });
      }
    } catch (error) {
      return res.status(400).json({ erro: 'Usúario não encontrado!' });
    }

    let thumbnailId;
    try {
      const { id } = await File.create({ name, path });
      if (!id) {
        return res
          .status(400)
          .json({ erro: 'Falha ao fazer Upload da thumbnail' });
      }
      thumbnailId = id;
    } catch (error) {
      return res.status(400).json({
        erro: 'Falha ao referenciar thumbnail no banco!',
        error,
      });
    }

    try {
      const spot = await Spot.create({
        company,
        price,
        techs: techs.split(',').map(tech => tech.trim()),
        id_user: userId,
        id_thumbnail: thumbnailId,
      });

      return res.status(200).json({ spot });
    } catch (error) {
      return res.status(401).json({ erro: 'Erro ao criar Spot', error });
    }
  }
}

export default new SpotController();
