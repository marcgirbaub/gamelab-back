class CustomError extends Error {
  code: string;

  constructor(
    message: string,
    public statusCode: number,
    public publicMessage: string
  ) {
    super(message);
  }
}

export default CustomError;
