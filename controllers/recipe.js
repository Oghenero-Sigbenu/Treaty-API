const db = require("../models");
const httpStatus = require("../util/httpStatus");
const Recipe = db.recipe;
const User = db.user;

exports.getall = (req, res, next) => {
    Recipe.findAll()
    .then(recipes => {
        res.status(httpStatus.SUCCESS).json({data:recipes, message: "Recipes fetched successfully", success: true})
    })
    .catch(err => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({success: false, message: "Error occured while fetching recipes" || err })
    })
}

// create recipe
exports.createRecipe = (req, res, next) => {
    const {name, cookTime, description, steps, user_id} = req.body;
    let imgUrl;
    if(req.path){
        imgUrl = req.file.path;
        User.findByPk(user_id)
        .then(user => {
            if(user){
                Recipe.create({name, cookTime, description, imgUrl, steps, user_id})
                .then(recipe => {
                    res.status(httpStatus.SUCCESS).json({data:recipe, message: "Recipe created successfully", success: true})
                })
                .catch(err => {
                    res.status(httpStatus.BAD_REQUEST).json({message: err || "Error occured while creating recipe"})
                })
            }else{
                res.status(httpStatus.UNAUTHORIZED).json({message: "Create an account"})
            }
        })
       .catch(err => {
        resjson({message: err || "Error occured"})

       })
    }
}

// get one recipe
exports.getRecipeById = (req, res, next) => {
    const id = req.params.id;
    Recipe.findOne({
        where:{id},
        include: [
            {
                all: true,
                attributes: { exclude:["password","updatedAt"]}
            }
        ]
    })
    .then(recipe => {
        if(recipe) {
            res.status(httpStatus.SUCCESS).json({data: recipe, message: "Recipe fetched successfully", success: true})
        }
        else{
            res.status(httpStatus.NOT_FOUND).json({success: false, message: "Recipe not found"})
        }
    })
    .catch(err => res.status(400).json({success: false, message: "Error Occured" || err}));
}

//delete a single recipe by id
exports.deleteRecipe = (req, res, next) => {
    const recipeId = req.params.id;
    const {user_id} = req.body;
    Recipe.findByPk(recipeId)
    .then(recipe => {
        if(recipe.user_id !== user_id) {
            res.status(httpStatus.UNAUTHORIZED).json({message: 'You do not have permission to do this.'})
        }
        else{
            recipe.destroy()
            .then(() => {
                res.status(200).json({success: true, message:"Successfully deleted recipe"}) })
            .catch(err => res.json({success: false, message: err}))
        }
    })
    .catch(err => res.json({success: false, message: err}))
}

//updating a recipe
exports.updateRecipe = (req, res, next) => {
    const {name, cookTime, description, steps, user_id} = req.body;
    const recipeId = req.params.id;
    let imgUrl;
    if (req.file) {
        imgUrl = req.file.path;
    }
    Recipe.findByPk(recipeId)
        .then(recipe => {
            if(parseInt(user_id) !== recipe.user_id){
                res.status(httpStatus.NOT_FOUND).json({message: "Recipe not created by you"})
            } 
            else{
                recipe.update({
                    name, cookTime, description, steps, user_id
                })
                .then(recipe => {
                    res.status(httpStatus.SUCCESS).json(recipe);
                })
                .catch((err)=>next(err))
            }
        })
        .catch(err =>
			res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Recipe does not exist", error: err })
		);
};