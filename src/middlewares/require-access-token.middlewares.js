import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { ACCESS_TOKEN_SECRET } from '../constants/env.constant.js';
import AuthRepository from '../repositories/auth.repository.js';

const authRepository = new AuthRepository();
export const requireAccessToken = async (req, res, next) => {
  try {
    // 인증 정보 파싱
    const authorization = req.headers.authorization;

    // Authorization이 없는 경우
    if (!authorization) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: 'Authorization이 없습니다.',
      });
    }

    // JWT 표준 인증 형태와 일치하지 않는 경우
    const [type, accessToken] = authorization.split(' ');

    if (type !== 'Bearer') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: 'JWT 표준 인증 형태와 일치하지 않습니다.',
      });
    }

    // AccessToken이 없는 경우
    if (!accessToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: '토큰이 없습니다.',
      });
    }

    let payload;
    try {
      payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    } catch (error) {
      // AccessToken의 유효기한이 지난 경우
      if (error.name === 'TokenExpiredError') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: '유효기간 만료되었습니다.',
        });
      }
      // 그 밖의 AccessToken 검증에 실패한 경우
      else {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: '검증 실패하였습니다.',
        });
      }
    }

    // Payload에 담긴 사용자 ID와 일치하는 사용자가 없는 경우
    const { id } = payload;
    const user = await authRepository.sameWithPayload(id);
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: '사용자 ID와 일치하지 않은 사용자입니다.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
