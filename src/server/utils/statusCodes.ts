const statusCodes = {
  clientError: { notFound: 404, badRequest: 400, unauthorized: 401 },
  serverError: {
    internalServer: 500,
  },
};

export default statusCodes;
