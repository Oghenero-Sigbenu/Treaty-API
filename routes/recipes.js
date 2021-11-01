module.exports = app => {
    const recipeController = require("../controllers/recipe");
    const upload = require("../middleware/upload");
    var router = require("express").Router();
  
    // Create a new user
    router.get("/all", recipeController.getall);
    router.post("/create", upload.single("imgUrl"), recipeController.createRecipe);
    router.get("/view/:id", recipeController.getRecipeById);
    router.delete("/delete/:id", recipeController.deleteRecipe);
    router.put("/edit/:id", upload.single("imgUrl"), recipeController.updateRecipe);

  app.use('/recipes', router);
};