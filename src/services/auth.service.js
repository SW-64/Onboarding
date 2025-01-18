import { ACCESS_TOKEN_SECRET } from '../constants/env.constant.js';
import AuthRepository from '../repositories/auth.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/http.error.js';
class AuthService {
  authRepository = new AuthRepository();
  // 회원가입
  signUp = async (username, password, nickname) => {
    // 같은 사용자 이름이 있다면 에러 반환
    const existedUser = await this.authRepository.getMyInfo(username);
    if (existedUser) throw new BadRequestError('이미 사용자가 있습니다.');
    const signUp = await this.authRepository.signUp(
      username,
      password,
      nickname,
    );
    return {
      username: signUp.username,
      nickname: signUp.nickname,
      authorities: [
        {
          authorityName: signUp.authority.authorityName,
        },
      ],
    };
  };
  // 로그인
  signIn = async (username, password) => {
    // 해당되는 user가 없다면 에러 반환
    const existedUser = await this.authRepository.getMyInfo(username);
    if (!existedUser || !bcrypt.compareSync(password, existedUser.password)) {
      throw new BadRequestError('사용자 정보 틀림');
    }
    const payload = { id: existedUser.userId };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    console.log(accessToken);
    return accessToken;
  };
}

export default AuthService;
