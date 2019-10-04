import jwt from 'jsonwebtoken';

import User from '../models/User';
import auth from '../../config/auth';

class SessionController {
  async store(req, res) {
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
