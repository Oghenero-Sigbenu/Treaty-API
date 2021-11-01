module.exports = app => {
    const likeController = require("../controllers/recipe");
    var router = require("express").Router();
  
    // Create a new user
    // router.get("/all", recipeController.getall);
    router.post("/add", upload.single("imgUrl"), recipeController.createRecipe);

  app.use('/like', router);
};