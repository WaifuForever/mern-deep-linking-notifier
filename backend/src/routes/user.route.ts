import { Router, Request, Response } from 'express';
import UserController from '../controllers/user.controller';
const routes = Router();

routes.post('/users', UserController.store);

export default routes;
