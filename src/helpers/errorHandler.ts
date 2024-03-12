/* eslint-disable no-unused-vars */
// handles jwt authentication error
// @ts-ignore
const errorHandler = (error, request, response, next) => {
  if (error) {
    return response
      .status(error.status)
      .json({ success: false, error: error.message });
  }
};

export default errorHandler;
