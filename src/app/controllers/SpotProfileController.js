import Spot from '../models/Spot';
import File from '../models/File';

module.exports = {
  async show(req, res) {
    const { userId } = req;
    const spotsUser = await Spot.findAll({
      where: { id_user: userId },
      include: [
        {
          model: File,
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.json(spotsUser);
  },
};
