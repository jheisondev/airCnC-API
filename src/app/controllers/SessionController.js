import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import auth from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      user_name: Yup.string()
        .required('Informe nome de usuário!')
        .min(3, 'O nome deve conter mais de 3 letras!'),
      password: Yup.string()
        .required('Informe a senha!')
        .min(6, 'Informe senha com no mínimo 6 caracteres')
        .max(8, 'Informe senha com no máximo 8 caracteres'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos!' });
    }
    const { user_name, password } = req.body;

    const user = await User.findOne({ where: { user_name } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não cadastrado!' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha inválida!' });
    }

    const { id, email } = user;
    return res.json({
      user: {
        id,
        user_name,
        email,
      },
      token: jwt.sign({ id }, auth.secret, {
        expiresIn: auth.expired,
      }),
    });
  }
}

export default new SessionController();
