import { Router, Request, Response } from 'express';
import UserController from '../controllers/user.controller';
import UserMiddleware from '../middlewares/user.middleware';

const routes = Router();

routes.post('/users', UserMiddleware.store, UserController.store);
routes.get('/users', UserMiddleware.list, UserController.list);
routes.get('/users/findOne', UserMiddleware.findById, UserController.findById);
routes.put('/users', UserMiddleware.update, UserController.update);
routes.delete('/users', UserMiddleware.findById, UserController.remove);

export default routes;
