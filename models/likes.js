module.exports = (sequelize, Sequelize) => {
   
    const Like = sequelize.define("like", {
        likes: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });
   
    return Like;
  };
 
 
  