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

  sameWithPayload = async (Id) => {
    const user = await prisma.user.findUnique({
      where: { userId: Id },
      // omit: { password: true },
    });
    return user;
  };

  // 리프레쉬 토큰 저장
  saveToToken = async (hashedRefreshToken, userId) => {
    await prisma.refreshToken.upsert({
      where: { userId: userId },
      update: { refreshToken: hashedRefreshToken },
      create: { userId: userId, refreshToken: hashedRefreshToken },
    });
  };

  // 리프레쉬 토큰 조회
  getToRefreshToken = async (userId) => {
    const existedRefreshToken = await prisma.refreshToken.findUnique({
      where: {
        userId: userId,
      },
    });
    return existedRefreshToken;
  };
}

export default AuthRepository;
