require('dotenv').config()

import { Router } from "express"
import { query } from 'express-validator'
import validation from '../middlewares/validation'
import Student from "../models/Student";
import db from '../db'

const router = Router()

router.get('/insert', [
    query('operationsCount').exists().withMessage('operationsCount is required').toInt().isInt({ min: 1000, max: 4000 }).withMessage('operationsCount should be less than 4000'),
    query('groupsCount').exists().toInt().isInt({ min: 1, max: 4 }),
    validation
], async (req, res, next) => {
    try {
        const { operationsCount, groupsCount } = req.query;

        await Student.truncate();
        
        const batchCount = Math.round(operationsCount / groupsCount);
        
        const times = [];

        for(let i = 0; i < groupsCount; i++){
            const startTime = new Date();
            await Student.bulkCreate(Array(batchCount).fill({
                firstName: 'firstName',
                lastName: 'lastName',
                age: 18
            }));
            const endTime = new Date();

            const diffTime = endTime - startTime;
            times.push(diffTime);
        }

        res.json({
            operation: 'insert',
            times,
        })
    }catch (err){
        next(err);
    }
})

router.get('/update', [
    query('operationsCount').exists().withMessage('operationsCount is required').toInt().isInt({ min: 1000, max: 4000 }).withMessage('operationsCount should be less than 4000'),
    query('groupsCount').exists().toInt().isInt({ min: 1, max: 4 }),
    validation
], async (req, res, next) => {
    try {
        const { operationsCount, groupsCount } = req.query;

        await Student.truncate();

        await Student.bulkCreate(Array(operationsCount).fill({
            firstName: 'firstName',
            lastName: 'lastName',
            age: 18
        }));

        const batchCount = Math.round(operationsCount / groupsCount);

        const studentIdsBatches = [];
        for(let i = 0; i < groupsCount; i++){
            const studentIds = (await Student.findAll({
                offset: i * batchCount,
                limit: batchCount,
            })).map(student => student.id)

            studentIdsBatches.push(studentIds);
        }

        const timesPromises = studentIdsBatches.map(async (studentIdsBatch, i) => {
            const startTime = new Date();
            await Student.update({
                age: 100 + i
            }, {
                where: {
                    id: studentIdsBatch,
                }
            });
            const endTime = new Date();

            const diffTime = endTime - startTime;
            return diffTime;
        })

        const times = await Promise.all(timesPromises);

        res.json({
            operation: 'update',
            times,
        })
    }catch (err){
        next(err);
    }
})

router.get('/delete', [
    query('operationsCount').exists().withMessage('operationsCount is required').toInt().isInt({ min: 1000, max: 4000 }).withMessage('operationsCount should be less than 4000'),
    query('groupsCount').exists().toInt().isInt({ min: 1, max: 4 }),
    validation
], async (req, res, next) => {
    try {
        const { operationsCount, groupsCount } = req.query;

        await Student.truncate();

        await Student.bulkCreate(Array(operationsCount).fill({
            firstName: 'firstName',
            lastName: 'lastName',
            age: 18
        }));

        const batchCount = Math.round(operationsCount / groupsCount);

        const studentIdsBatches = [];
        for(let i = 0; i < groupsCount; i++){
            const studentIds = (await Student.findAll({
                offset: i * batchCount,
                limit: batchCount,
            })).map(student => student.id)

            studentIdsBatches.push(studentIds);
        }

        const timesPromises = studentIdsBatches.map(async (studentIdsBatch, i) => {
            const startTime = new Date();
            await Student.destroy({
                where: {
                    id: studentIdsBatch,
                }
            });
            const endTime = new Date();

            const diffTime = endTime - startTime;
            return diffTime;
        })

        const times = await Promise.all(timesPromises);

        res.json({
            operation: 'delete',
            times,
        })
    }catch (err){
        next(err);
    }
})

export default router;
