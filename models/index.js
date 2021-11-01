const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.js")(sequelize, Sequelize);
db.recipe = require("./recipe.js")(sequelize, Sequelize);
db.likes = require("./likes.js")(sequelize, Sequelize);
db.comments = require("./comment.js")(sequelize, Sequelize);

db.recipe.belongsTo(db.user, {
  through: "recipe",
  as: "user",
  foreignKey: "user_id"
})

db.likes.belongsTo(db.user, {
  through: "user",
  as: "user",
  foreignKey: "user_id"
});

db.likes.belongsTo(db.recipe, {
  through: "recipe",
  as: "recipe",
  foreignKey: "recipe_id"
});
db.comments.belongsTo(db.recipe, {
  through: "recipe",
  as: "recipe",
  foreignKey: "recipe_id"
});
db.comments.belongsTo(db.user, {
  through: "user",
  as: "user",
  foreignKey: "user_id"
});
// db.comments.belongsToMany(db.recipe, {
  // through: "comment",
  // as: "comment",
  // // foreignKey: "comments",
  // otherKey: "comments"
// });

module.exports = db;
