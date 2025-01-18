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
        authority: {
          connect: { authorityId: 1 },
        },
      },
      include: {
        authority: true,
      },
    });
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

  SameWithPayload = async (Id) => {
    const user = await prisma.user.findUnique({
      where: { userId: Id },
      // omit: { password: true },
    });
    return user;
  };
}

export default AuthRepository;
