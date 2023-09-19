import express from "express";
import asyncHandler from 'express-async-handler';
import EmployeesService from "../service/EmployeesService.mjs";
import authVerification from '../middleware/authVerification.mjs';
import Joi from 'joi';
import config from 'config';
import { validate } from "../middleware/validation.mjs";
export const employees = express.Router();

const DEPTS = config.get('employee.departments');
const MIN_SALARY = config.get('employee.minSalary');
const MAX_SALARY = config.get('employee.maxSalary');
const MIN_DATE = config.get('employee.minDate');
const MAX_DATE = config.get('employee.maxDate');
const MIN_ID = config.get('employee.minId');
const MAX_ID = config.get('employee.maxId');

const employeesService = new EmployeesService();
const schema = Joi.object({
    name: Joi.string().pattern(/^([A-Z][a-z]{1,15})$/).required(),
    department: Joi.string().valid(...DEPTS).required(),
    salary: Joi.number().min(MIN_SALARY).max(MAX_SALARY).required(),
    gender: Joi.string().valid('male', 'female').required(),
    birthDate: Joi.date().min(MIN_DATE).max(MAX_DATE).required(),
    id: Joi.number().min(MIN_ID).max(MAX_ID)
})

employees.delete('/:id', asyncHandler(
    async (req, res) => {
        const id = +req.params.id;
        if (!await employeesService.deleteEmployee(id)){
                res.status(404);
                throw `employee with id ${id} not found`
        }
        res.send();
    }
))
employees.use(validate(schema))
employees.post('', authVerification("ADMIN"),asyncHandler(
    async (req,res) => {
        if(req.joiError) {
            res.status(400);
            throw (req.joiError)
        }
        const emplRes = await employeesService.addEmployee(req.body);
        if (emplRes == null) {
            res.status(400);
            throw `employee with id:${req.body.id} already exists`
        }
        res.status(201).send(emplRes);
    }
) )
employees.get('/:id',authVerification("ADMIN", "USER"),asyncHandler(
    async (req,res) => {
        const emplId = +req.params.id;
        const emplRes = await employeesService.getEmployee(emplId);
        if(!emplRes) {
            res.status(404);
            throw `employee with id ${emplId} not found`
        }
        res.send(emplRes);
    }
))
employees.get('',authVerification("ADMIN", "USER"),asyncHandler(
    async (req,res) => {
        const employeesRes = await employeesService.getAllEmployees();
        if(employeesRes.length == 0) {
            res.status(404);
            throw 'employees collection is empty'
        }
        res.send(employeesRes);
    }
))
employees.put('/:id',authVerification("ADMIN"), asyncHandler(
    async(req,res) => {
        if(req.joiError) {
            res.status(400);
            throw (req.joiError)
        }
        const id = +req.params.id;
        const emplRes = await employeesService.updateEmployee({...req.body, id});
        if (emplRes==null) {
            res.status(400);
            throw `employee with id ${req.body.id} wasn't updated`
        }
        res.status(200).send(emplRes);
    }
))