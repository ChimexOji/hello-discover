import express from 'express';

// IMPORT ALL THE CONTROLLERS
import { createUser, getAllUSers, getUserInfoByID } from '../controllers/user.controller.js';

const router = express.Router();

// router for all controllers
router.route('/').get(getAllUSers);
router.route('/').post(createUser);
router.route('/:id').get(getUserInfoByID);

export default router;