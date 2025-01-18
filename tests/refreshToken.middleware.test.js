import { requireRefreshToken } from '../src/middlewares/require-refresh-token.middleware.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  HASHROUNDS,
  REFRESH_TOKEN_SECRET,
} from '../src/constants/env.constant.js';
import { jest } from '@jest/globals';
import { prisma } from './../src/utils/prisma.util';
import AuthRepository from '../src/repositories/auth.repository.js';
describe('🔹 requireRefreshToken 미들웨어 유닛 테스트', () => {
  let req, res, next, mockAuthRepository;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    mockAuthRepository = {
      getToRefreshToken: jest.fn(),
      sameWithPayload: jest.fn(),
      getToRefreshToken: jest.fn(),
    };
    //AuthRepository.mockImplementation(() => mockAuthRepository);
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('Authorization이 없는 경우 401 반환', async () => {
    await requireRefreshToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 401,
      message: 'Authorization이 없습니다.',
    });
  });

  test('잘못된 refreshToken이면 401 반환', async () => {
    req.headers.authorization = 'Bearer invalidToken';

    await requireRefreshToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 401,
      message: '검증 실패하였습니다.',
    });
  });
});
