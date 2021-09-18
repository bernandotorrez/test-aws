const express = require('express');
require('express-async-errors');
const router = express.Router();
const httpStatus = require('http-status');
const InvariantError = require('../../exceptions/InvariantError');

// Repositories
const TaskRepository = require('../../repositories/mysql/taskRepository');
const taskRepository = new TaskRepository();

const taskValidator = require('../../validators/taskValidator');

// Rabbit MQ Example
// await rabbitMq.sendMessage(`export:task:${id}`, JSON.stringify(tasks));

// Explain : using try catch to check if data found in Cache / Redis or no
// Error Handling should in Repository

router.get('/', async (req, res) => {
   const tasks = await taskRepository.getTasks();

   res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      status: 'SUCCESS',
      message: httpStatus[`${httpStatus.OK}_NAME`],
      data: tasks
   });
})

router.get('/:id', async (req, res) => {
   const {
      id
   } = req.params;

   const tasks = await taskRepository.getTask({
      id
   });

   res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      status: 'SUCCESS',
      message: httpStatus[`${httpStatus.OK}_NAME`],
      data: tasks
   });
})

router.post('/', async (req, res) => {
   taskValidator.AddTaskValidator(req.body);

   const task = await taskRepository.addTask(req.body);

   res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED,
      status: 'SUCCESS',
      message: httpStatus[`${httpStatus.CREATED}_NAME`],
      data: task
   });
})

router.put('/:id', async (req, res) => {
   const { id } = req.params;
   
   const task = await taskRepository.updateTask({ id, body: req.body })

   res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED,
      status: 'SUCCESS',
      message: httpStatus[`${httpStatus.CREATED}_NAME`],
      data: task
   });
})

router.delete('/:id', async (req, res) => {
   const { id } = req.params;
   
   const task = await taskRepository.deleteTask({ id })

   res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      status: 'SUCCESS',
      message: httpStatus[`${httpStatus.OK}_NAME`],
      data: task
   });
})

module.exports = router;