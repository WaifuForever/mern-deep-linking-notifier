import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './config/express.config';

mongoose.connect(process.env.DB_CONNECTION as string);
const server = require('http').Server(app);

console.log(process.env.PORT)
const PORT: number = parseInt(process.env.PORT as string, 10);
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
