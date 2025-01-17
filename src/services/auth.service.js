import { ACCESS_TOKEN_SECRET } from '../constants/env.constant.js';
import AuthRepository from '../repositories/auth.repository.js';
import jwt from 'jsonwebtoken';
class AuthService {
  authRepository = new AuthRepository();
  // 회원가입
  signUp = async (username, password, nickname) => {
    const signUp = await this.authRepository.signUp(
      username,
      password,
      nickname,
    );
    return {
      username: signUp.username,
      nickName: signUp.nickName,
      authorities: signUp.authorities,
    };
  };
  // 로그인
  signIn = async (username, password) => {
    // 해당되는 user가 없다면 에러 반환
    const existedUser = await this.authRepository.getMyInfo(username);
    if (!existedEmail || !bcrypt.compareSync(password, existedUser.password)) {
      throw new BadRequestError('사용자 정보 틀림');
    }
    const payload = { id: userId };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    console.log(accessToken);
    return accessToken;
  };
}

export default AuthService;
