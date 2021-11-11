module.exports = (sequelize, Sequelize) => {
   
    const Recipe = sequelize.define("recipe", {
        name: {
            type: Sequelize.STRING
          },
          imgUrl: {
            type: Sequelize.STRING
          },
          description: {
            type: Sequelize.STRING
          },
          ingredients : {
            type: Sequelize.STRING
          },
          steps: {
            type: Sequelize.STRING
          },
          cookTime: {
            type: Sequelize.STRING
          }
    });
   
    return Recipe;
  };
 
 
  