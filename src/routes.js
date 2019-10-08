import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/multer';
import auth from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import SpotController from './app/controllers/SpotController';
import SpotProfileController from './app/controllers/SpotProfileController';
import BookingController from './app/controllers/BookingController';

const routes = new Router();
const upload = multer(uploadConfig);

// Rotas
routes.post('/users', upload.single('avatar'), UserController.store);
routes.post('/sessions', SessionController.store);

// Rota de autorização
routes.use(auth);

routes.post('/spots', upload.single('thumbnail'), SpotController.store);
routes.get('/spots', SpotController.index);
routes.get('/spotsProfile', SpotProfileController.show);
routes.post('/spots/bookings/:id_spot', BookingController.store);

export default routes;
