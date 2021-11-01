const db = require("../models");
const httpStatus = require("../util/httpStatus");
const Likes = db.like;
const User = db.user;
exports.getLikes = (req, res, next) => {
	const id = req.params.id;
	Like.findAndCountAll({
		where: {
			RecipeId: id
		},
		include: [{
			all: true
		}]
	})
		.then((likes) => {
			res.json(likes)
		})
		.catch(err => res.json({ success: false }))
}

exports.postLike = (req, res, next) => {
	const {user_id,recipe_id, likes} = req.body;
	Like.findOne({
		where: {
			recipe_id,
		}
	})
	.then(recipe => {
		Like.create({
			user_id,
			recipe_id, likes: likes + 1 
		})
			.then((like => {
				res.json({ like, success: true })
			}))
			.catch((err) => res.json({ message: "Error occured", Error: err }));
	})
	.catch((err) => res.json({ message: "Failed", Error: err }));

}