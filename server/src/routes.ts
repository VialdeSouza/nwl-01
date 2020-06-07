import express from 'express';
import PointsControllers from './controllers/pointsControllers';
import ItemsControllers from './controllers/itemsControllers';
import multerConfig from './config/multer';
import {celebrate, Joi} from 'celebrate';
import multer from 'multer';


const routes = express.Router();
const pointsControllers = new PointsControllers();
const itemsControllers = new ItemsControllers();
const upload = multer(multerConfig);

routes.get('/items', itemsControllers.index)

routes.post(
    '/points', 
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),

        })
    }),
    pointsControllers.create
    );

routes.get('/points', pointsControllers.index);
routes.get('/points/:id', pointsControllers.show);
export default routes;