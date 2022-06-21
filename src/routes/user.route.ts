import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import UserController from '../controllers/user.controller';
import UserMiddleware from '../middlewares/user.middleware';

const routes = Router();

routes.post('/users', auth, UserMiddleware.store, UserController.store);
routes.get('/users', UserMiddleware.list, UserController.list);
routes.get('/users/findOne', UserMiddleware.findById, UserController.findById);
routes.put('/users', auth, UserMiddleware.update, UserController.update);
routes.delete('/users', auth, UserMiddleware.findById, UserController.remove);

export default routes;
