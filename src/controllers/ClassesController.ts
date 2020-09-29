import { Request, Response } from 'express'

import convertHourToMinutes from "../utils/convertHourToMinutes";
import db from '../database/connection';

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController {

    async index (request: Request, response: Response) {
        const filters = request.query;

        const week_day = filters.week_day as string;
        const subject = filters.subject as string;
        const time = filters.time as string;

        if (!filters.week_day || !filters.subject || !filters.time) {
            return response.status(400).json({
                error: 'Missing filters to search classes'
            })
        }

        const timeInMinutes = convertHourToMinutes(time);

        const classes = await db('classes')
            .whereExists(function() {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']);

        return response.json(classes);
    }

    async create (request: Request, response: Response) {
        /* const data = request.body;
        console.log(data); Verifica o que tem na saída do request.body*/
        const {
             name,
             avatar,
             whatsapp,
             bio,
             subject,
             cost,
             schedule
         } = request.body;


     
         const trx = await db.transaction(); /* Variavel transaction para desfaer todas as alterações quaso haja erro em qualquer tabela */
     
         try{
             const insertedUsersIds = await trx('users').insert({ 
                 name,
                 avatar,
                 whatsapp,
                 bio,
             });
         
             const user_id = insertedUsersIds[0];
         
             const insertedClassesIds = await trx('classes').insert({ 
                 subject,
                 cost,
                 user_id,
             });
         
             const class_id = insertedClassesIds[0];
         
             const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                 return {
                     week_day: scheduleItem.week_day,
                     from: convertHourToMinutes(scheduleItem.from),
                     to: convertHourToMinutes(scheduleItem.to),
                     class_id,
                 };
             })
             
             await trx('class_schedule').insert(classSchedule);
         
             await trx.commit();
         
            return response.status(201).send();
         } catch (err){
             console.log(err);
             await trx.rollback(); /* Desfaz as alterações que foram feitas antes do erro ocorrer */
     
             return response.status(400).json({
                 error: 'Unexpected error while creating new class'
             })
         }
     
     }
}