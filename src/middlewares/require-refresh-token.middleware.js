import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { REFRESH_TOKEN_SECRET } from '../constants/env.constant.js';
import AuthRepository from '../repositories/auth.repository.js';
import bcrypt from 'bcrypt';
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
    const [type, refreshToken] = authorization.split(' ');

    if (type !== 'Bearer') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: 'JWT 표준 인증 형태와 일치하지 않습니다.',
      });
    }

    // AccessToken이 없는 경우
    if (!refreshToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: '토큰이 없습니다.',
      });
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      // refreshToken의 유효기한이 지난 경우
      if (error.name === 'TokenExpiredError') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: '유효기간 만료되었습니다.',
        });
      }
      // 그 밖의 refreshToken 검증에 실패한 경우
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

    //DB에 저장 된 RefreshToken이 없거나 전달 받은 값과 일치하지 않는 경우
    const existedRefreshToken = await authRepository.getToRefreshToken(id);
    const isValidRefreshToken =
      existedRefreshToken?.refreshToken &&
      bcrypt.compareSync(refreshToken, existedRefreshToken.refreshToken);
    if (!isValidRefreshToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: '폐기된 인증 정보입니다.',
      });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
