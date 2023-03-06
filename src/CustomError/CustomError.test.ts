import CustomError from "./CustomError";

describe("Given the CustomError class", () => {
  describe("When instantiated with the message `Endpoint not found`, statusCode 404 and the public message `Endpoint not found`", () => {
    test("Then the instance should have the properties with the messages and statusCode", () => {
      const expectedError = {
        statusCode: 404,
        message: "Endpoint not found",
        publicMessage: "Endpoint not found",
      };

      const customError = new CustomError(
        expectedError.message,
        expectedError.statusCode,
        expectedError.publicMessage
      );

      expect(customError).toHaveProperty(
        "statusCode",
        expectedError.statusCode
      );
      expect(customError).toHaveProperty("message", expectedError.message);
      expect(customError).toHaveProperty(
        "publicMessage",
        expectedError.publicMessage
      );
    });
  });
});
