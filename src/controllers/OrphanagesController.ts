import {Request, Response} from 'express';
import Orphanage from '../models/Orphanage';
import orphanagemView from '../views/orphanages_view'

import { getRepository } from 'typeorm';
import orphanages_view from '../views/orphanages_view';

export default {

    async index(req: Request, res: Response) {

        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });

        return res.json(orphanages_view.renderMany(orphanages));
    },

    async show(req: Request, res: Response) {

        const { id } = req.params;

        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        });

        return res.json(orphanagemView.render(orphanage));
    },




    async create (req: Request, res: Response) {
        const { 
            name, 
            latitude, 
            longitude, 
            about, 
            instructions, 
            opening_hours, 
            open_on_weekends } = req.body;
    
        const orphanagesRepository = getRepository(Orphanage);

        const requestImg = req.files as Express.Multer.File[];

        const images = requestImg.map(image => {
            return { path: image.filename};
        })

      
    
        const orphanage = orphanagesRepository.create({
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            images
        });
    
        await orphanagesRepository.save(orphanage);
    
        return res.status(201).json(orphanage);
    }
}