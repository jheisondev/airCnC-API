import * as Yup from 'yup';
import Booking from '../models/Booking';

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
      const booking = await Booking.create({
        id_user: userId,
        id_spot,
        date,
      });

      return res.json(booking);
    } catch (error) {
      return res.json(error);
    }
  },
};
