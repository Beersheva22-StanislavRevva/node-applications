import express from 'express'
import Joi from 'joi'
import config from 'config'
import { validate } from '../middleware/validation.mjs';
import UserService from '../service/UsersService.mjs';
export const users = express.Router();

const usersSerice = new UserService(process.env.ATLAS_URI_ACCOUNTS_TEST, config.get('mongodb.db'), config.get('nUsers'));
const schema = Joi.object({
    username: Joi.string().alphanum().min(5).required(),
    password: Joi.string().min(5).required(),
    roles: Joi.array().items(Joi.string().valid('ADMIN', 'USER'))
});
users.use(validate(schema))
users.post('/sign-up', (req, res) => {
    if(!req.validated) {
        res.status(500);
        throw ("This API requires validation");
    } if(req.joiError) {
       res.status(400);
        throw (req.joiError)
    }
    res.status(201).send( usersSerice.addAccount(req.body));

});


// users.get('/kuku1', (req,res) => {
//     res.send('kuku')
// })
