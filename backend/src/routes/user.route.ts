import { Router, Request, Response } from 'express';
import UserController from '../controllers/user.controller';
const routes = Router();

routes.post('/users', UserController.store);
routes.get('/users', UserController.list);
routes.get('/users/findOne', UserController.findById);
routes.put('/users', UserController.update);
routes.delete('/users', UserController.remove);

export default routes;
