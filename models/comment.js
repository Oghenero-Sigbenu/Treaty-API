module.exports = (sequelize, Sequelize) => {
   
    const Comment = sequelize.define("comment", {
        comments :{
            type: Sequelize.STRING,
            allowNull: false
        },
        username :{
            type: Sequelize.STRING,
            allowNull: false
        }
    });
   
    return Comment;
  };
 
 