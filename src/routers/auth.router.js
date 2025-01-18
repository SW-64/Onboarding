import express from 'express';
import { prisma } from './../utils/prisma.util.js';
import AuthRepository from '../repositories/auth.repository.js';
import AuthService from '../services/auth.service.js';
import AuthController from '../controllers/auth.controller.js';

const authRouter = express.Router();
const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

// 회원가입
/**
 * @swagger
 * components:
 *   schemas:
 *     AuthSignUp:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - nickname
 *       properties:
 *         username:
 *           type: string
 *           description: "사용자 아이디"
 *         password:
 *           type: string
 *           description: "사용자 비밀번호"
 *         nickname:
 *           type: string
 *           description: "사용자 닉네임"
 *       example:
 *         username: "JIN HO"
 *         password: "12341234"
 *         nickname: "Mentos"
 *
 *     AuthSignIn:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: "사용자 아이디"
 *         password:
 *           type: string
 *           description: "사용자 비밀번호"
 *       example:
 *         username: "JIN HO"
 *         password: "12341234"
 */

/**
 * @swagger
 * /api/auth/sign-up:
 *   post:
 *     summary: "회원가입 API"
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthSignUp'
 *     responses:
 *       201:
 *         description: "회원가입 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "JIN HO"
 *                 nickname:
 *                   type: string
 *                   example: "Mentos"
 *                 authorities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       authorityName:
 *                         type: string
 *                         example: "ROLE_USER"
 *       400:
 *         description: "잘못된 요청"
 */
authRouter.post('/sign-up', authController.signUp);

// 로그인
/**
 * @swagger
 * /api/auth/sign-in:
 *   post:
 *     summary: "로그인 API"
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthSignIn'
 *     responses:
 *       200:
 *         description: "로그인 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1..."
 *
 *       401:
 *         description: "인증 실패"
 */
authRouter.post('/sign-in', authController.signIn);

export { authRouter };
