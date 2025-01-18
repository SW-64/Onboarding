import { requireAccessToken } from '../src/middlewares/require-access-token.middlewares.js';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../src/constants/env.constant.js';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('requireAccessToken 미들웨어 유닛 테스트', () => {
  let req, res, next, mockAuthRepository;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    mockAuthRepository = {
      getToRefreshToken: jest.fn(),
      sameWithPayload: jest.fn(),
    };
  });

  test('Authorization 헤더가 없으면 401 반환', () => {
    requireAccessToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 401,
      message: 'Authorization이 없습니다.',
    });
  });

  test('잘못된 형식의 Authorization 헤더가 주어지면 401 반환', () => {
    req.headers.authorization = 'Basic token123';

    requireAccessToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 401,
      message: 'JWT 표준 인증 형태와 일치하지 않습니다.',
    });
  });

  test('유효하지 않은 accessToken이면 401 반환', () => {
    req.headers.authorization = 'Bearer invalidToken';

    requireAccessToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 401,
      message: '검증 실패하였습니다.',
    });
  });
});
