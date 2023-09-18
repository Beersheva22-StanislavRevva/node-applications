import express from 'express'
import { users } from './routes/users.mjs';
import cors from 'cors';
import bodyParser from 'body-parser'
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.mjs';
import config from 'config';
import auth from './middleware/auth.mjs';
import  {employees} from './routes/employees.mjs'

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(auth);
app.use('/employees', employees)
app.use('/users',users);
const port = process.env.PORT || config.get('server.port');
const server = app.listen(port);
server.on("listening", () => console.log(`server is listening on port ${server.address().port}`));
app.use(errorHandler);