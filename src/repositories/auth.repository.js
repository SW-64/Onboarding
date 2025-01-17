import { prisma } from '../utils/prisma.util.js';
import bcrypt from 'bcrypt';
import { HASHROUNDS } from '../constants/env.constant.js';
class AuthRepository {
  // 회원가입
  signUp = async (username, password, nickname) => {
    const hashedPassword = bcrypt.hashSync(password, +HASHROUNDS);
    const { password: _, ...user } = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        nickname,
      },
      select: {
        authority: {},
      },
    });
    console.log(user);
    return user;
  };

  //내 정보 확인
  getMyInfo = async (username) => {
    const getMyInfo = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    return getMyInfo;
  };
}

export default AuthRepository;
