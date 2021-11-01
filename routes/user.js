
module.exports = app => {
    const user = require("../controllers/user.js");
  
    var router = require("express").Router();
  
    // Create a new user
    router.get("/all", user.getAll);
    router.post("/create", user.create);
    router.post("/login", user.login);
    router.get("/user", user.getCurrentUser);
    router.post("/update/:id", user.update);

  app.use('/user', router);
};