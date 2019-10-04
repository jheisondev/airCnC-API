import File from '../models/File';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    // check user exists
    try {
      const userExists = await User.findOne({
        where: { user_name: req.body.user_name },
      });
      const emailExists = await User.findOne({
        where: { email: req.body.email },
      });
      if (userExists || emailExists) {
        return res.json({ erro: 'Usuário ou email já cadastrados!' });
      }
    } catch (error) {
      return res.json({ erro: 'Servidor indisponível!', error });
    }

    try {
      const { id: avatarId } = await File.create({ name, path });

      const { full_name, user_name, email, password } = req.body;

      const { id, id_avatar } = await User.create({
        id_avatar: avatarId,
        full_name,
        user_name,
        email,
        password,
      });

      return res.json({ id, id_avatar, full_name, user_name, email });
    } catch (error) {
      return res.json({ erro: 'Create User', error });
    }
  }
}

export default new UserController();
