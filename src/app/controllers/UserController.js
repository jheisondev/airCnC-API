import * as Yup from 'yup';
import File from '../models/File';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const schema = Yup.object().shape({
      full_name: Yup.string()
        .required('Informe o nome completo!')
        .min(6, 'O nome deve conter mais de 3 letras!'),
      user_name: Yup.string()
        .required('Informe nome de usuário!')
        .min(3, 'O nome deve conter mais de 3 letras!'),
      email: Yup.string()
        .required('Informe email!')
        .email('Informe email válido!'),
      password: Yup.string()
        .required('Informe a senha!')
        .min(6, 'Informe senha com no mínimo 6 caracteres')
        .max(8, 'Informe senha com no máximo 8 caracteres'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos!' });
    }
    // check user exists
    try {
      const userExists = await User.findOne({
        where: { user_name: req.body.user_name },
      });
      const emailExists = await User.findOne({
        where: { email: req.body.email },
      });
      if (userExists || emailExists) {
        return res
          .status(401)
          .json({ erro: 'Email e Usuario já cadastrados!' });
      }
    } catch (error) {
      return res.status(503).json({ erro: 'Servidor indisponível!', error });
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

      return res
        .status(200)
        .json({ id, id_avatar, full_name, user_name, email });
    } catch (error) {
      return res.status(503).json({ erro: 'Create User', error });
    }
  }
}

export default new UserController();
