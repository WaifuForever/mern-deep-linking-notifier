import { Router, Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';

const routes = Router();

routes.get('/signIn', AuthController.signIn);

export default routes;
