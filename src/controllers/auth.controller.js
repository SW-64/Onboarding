import AuthService from '../services/auth.service.js';
import { HTTP_STATUS } from './../constants/http-status.constant.js';
class AuthController {
  authService = new AuthService();

  // 회원가입
  signUp = async (req, res, next) => {
    try {
      const { username, password, nickname } = req.body;
      const signUp = await this.authService.signUp(
        username,
        password,
        nickname,
      );

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: '회원가입 성공',
        data: signUp,
      });
    } catch (err) {
      next(err);
    }
  };
  // 로그인
  signIn = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const signIn = await this.authService.signIn(username, password);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: '로그인 성공',
        data: signIn,
      });
    } catch (err) {
      next(err);
    }
  };
}

export default AuthController;
