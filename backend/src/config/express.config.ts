import express from 'express';

import appRoute from '../routes/app.route';

const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(appRoute);

export { app };
