const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');  //importing bcryptjs
const jwt = require("jsonwebtoken");
const AUTH_SECRET_KEY = "fcdCf6Ly0j1OG2zddYKf55MTjLr330h7";
// Retrieve all Tutorials from the database.
exports.getAll = (req, res, next) => {
  User.findAll(
    {
      include: [
        {
          all: true,
          attributes: { exclude: ["fullName", "email", "phone", "userName"] }
        }]
    }
  )
    .then(data => {
      res.send(data);
      console.log(data)
    })
    .catch(err => {
      console.log(err)
      // res.status(500).send({
      //   message:
      //     err.message || "Some error occurred while retrieving tutorials."
      // });
    });
};

//create user account
exports.create = (req, res, next) => {
  const { fullName, email, phone, userName, password } = req.body;
  if (!fullName || !email || !phone || !userName || !password) {
    res.status(400).json({
      message: "Content can not be empty!"
    });
  }
  User.findOne({
    where: {
      email
    }
  })
    .then(isUser => {
      if (isUser) {
        res.status(400).json({
          message: "Email already exist"
        });
      } else {
        let hashedPassword;
        try {
          const salt = bcrypt.genSaltSync(10);
          hashedPassword = bcrypt.hashSync(password, salt);
        } catch (error) {
          throw error;
        }
        User.create({ fullName, email, phone, userName, password: hashedPassword })
          .then(user => {
            jwt.sign(
              { id: user.id }, AUTH_SECRET_KEY,
              { expiresIn: "100h" }, (err, token) => {
                return res.status(200).json({
                  token,
                  user
                })
              })
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving user detail."
            });
          });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user detail."
      });
    })

};

//user login
exports.login = (req, res, next) => {
  const {email, password} = req.body;
  if (!email || !password) {
		res.status(400).json({ msg: "All Field are required" });
	}
	else {
		User.findOne({
			where: { email },
			include: [{
				all: true
			}]
		})
			.then(user => {
				if (!user) {
					return res.status(400).json({ msg: "Invalid Email" });
				}
				bcrypt
					.compare(password, user.password)
					.then(match => {
						if (!match) {
							return res.status(400).json({ msg: "Invalid Password" });
						}
						jwt.sign(
							{ id: user.id },
							AUTH_SECRET_KEY,
							{ expiresIn: "5h" },
							(err, token) => {
								res.status(200).json({
									token,
									user
								});
							}
						);
					})
					.catch(err => res.json({ msg: "failed", error: err }))
			})
			.catch(err => res.json({ msg: "failed", error: err }))
	}
}

//user update
exports.update = (req, res, next) => {
  const { fullName, email, phone, userName } = req.body;
  const userId = req.params.id;
  User.findByPk(userId)
  .then(user => {
    if(user.id !== userId) {
      res.json({msg: "You do not have access"})
    }else{
      user.update({
        fullName, email, phone, userName
      })
      .then(updatedUser => {
          res.json(updatedUser)
      })
      .catch((err) => next(err))
    }
  })
  .catch(err => {
			res.status(500).json({ msg: "User does not exist", error: err })
  })
}

exports.getCurrentUser = (req, res, next) => {
  const userId = req.id;
  User.findOne({
    where: {
      id: userId
    },
    include: [{
      all: true
    }]
  })
    .then(user => {
      res.json(user);
    })
    .catch(error =>
      res
        .status(500)
        .json({ msg: "Something went wrong while fetching the user", error })
    );
};
