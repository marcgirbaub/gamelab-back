import {
  type UserRegisterCredentials,
  type UserCredentials,
} from "../server/controllers/userControllers/types";

export const mockUserId = {
  username: "mark4",
  _id: "384575839204",
};

export const mockUser: UserCredentials = {
  username: "mark4",
  password: "mark1234",
};

export const mockUserRegister: UserRegisterCredentials = {
  ...mockUser,
  email: "example@email.com",
};

export const newUser: UserRegisterCredentials = {
  username: "mark4",
  password: "mark1234",
  email: "mark@gmail.com",
};

export const hashedPassword = "asdfasdg3425342dsafsdfg";

export const mockedToken = "asdfasdfasdfgsadf3242345";
