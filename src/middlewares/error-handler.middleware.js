import { HTTP_STATUS } from "../constants/http-status.constant";

export const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: "에러",
  });
};
