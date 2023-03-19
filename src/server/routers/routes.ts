const routes = {
  users: {
    login: "/login",
    register: "/register",
  },
  games: {
    create: "/create",
    delete: "/delete/:gameId",
    detail: "/:gameId",
    mygames: "/mygames",
    update: "/update/:gameId",
  },
};

export default routes;
