export const successResponse = ({
  res,
  status = 200,
  message,
  data = undefined,
} = {}) => {
  return res.status(status).json({ message, data });
};
