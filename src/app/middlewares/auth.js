import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ error: 'Usuário não autorizado!' });
  }

  const [, token] = auth.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token de autenticação inválido!' });
  }
};
