const statusCodes = {
  clientError: {
    notFound: 404,
    badRequest: 400,
    unauthorized: 401,
    conflict: 409,
  },
  serverError: {
    internalServer: 500,
  },

  success: { okCode: 200, created: 201 },
};

export default statusCodes;
