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
  },
};

export default routes;
