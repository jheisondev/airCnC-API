import * as Yup from 'yup';
import Booking from '../models/Booking';
import Spot from '../models/Spot';
import User from '../models/User';
import File from '../models/File';

module.exports = {
  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.string()
        .required('Informe uma data completo!')
        .min(6, 'Ex: 30 de Out'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos!' });
    }

    const { userId } = req;
    const { id_spot } = req.params;
    const { date } = req.body;

    try {
      await Booking.create({
        id_user: userId,
        id_spot,
        date,
      });

      const bookingUserSpot = await Booking.findAll({
        where: { id_user: userId },
        attributes: ['id', 'id_user', 'id_spot', 'date'],
        include: [
          {
            model: User,
            attributes: ['id', 'user_name', 'email', 'id_avatar'],
            include: [
              {
                model: File,
                attributes: ['id', 'name', 'path', 'url'],
              },
            ],
          },
          {
            model: Spot,
            attributes: ['id', 'company', 'price', 'techs', 'id_thumbnail'],
            include: [
              {
                model: File,
                attributes: ['id', 'name', 'path', 'url'],
              },
            ],
          },
        ],
      });

      return res.json(bookingUserSpot);
    } catch (error) {
      return res.json(error);
    }
  },
};
