const mongoose = require('mongoose');

//import oAuthAccessToken
const oAuthAccessToken = require('../routes/api/generators/oAuthAccessToken');

//import user model
const User = require('../models/user');
const Token = require('../models/token');

//import momentjs
const moment = require('moment');

exports.user_register = async (req, res, next) => {
    let email = req.body.email;

    // Check if the user exists before inserting a document
    let user = await User.find({ email }).exec();

    if (user.length >= 1) {
        return res.status(409).json({
            message: 'Mail exists'
        });
    } else {
        // Generate user with hashed password
        let password = req.body.password;
        console.log("Password", password);

        try {
            let salt = 10;

            /************************
             ** Encrypt Password
             ***********************/
            const passwordHash = await oAuthAccessToken.getHash(password, salt);
            // console.log("Password Hash", passwordHash);

            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email,
                password: passwordHash
            });

            // try {
            let result = await user.save();
            console.log("user:", result);

            res.status(201).json({
                message: 'User created',
                id: result._id,
            });
        } // try
        catch (error) {
            console.log("ERROR", error);
            return res.status(500).json({
                error: error
            });
        } // catch  
    } // else
};

exports.user_refreshTokens = async (req, res, next) => {
    let email = req.body.email;
    console.log("user_controller: " + email);
    User.findOne({ email })
        .then(async user => {
            // Error
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            // Success
            else {
                let endTime = oAuthAccessToken.getExpiration();
                /*******************
                 * Create New Tokens
                 *******************/
                let access_token;
                let refresh_token;
                /*******************************************
                * Returns signed JWT TOken
                *******************************************/
                access_token = oAuthAccessToken.createAccessToken(email, user._id);
                refresh_token = oAuthAccessToken.createRefreshToken(email, user._id);
                console.log("TOKEN:", access_token);
                return res.status(200).json({
                    message: 'Auth successful',
                    access_token: access_token,
                    refresh_token: refresh_token,
                    // expiration: endTime.toString(),
                    expiration: endTime,
                    email
                });
            } // else
        })
        .catch(err => {
            console.log(err);
            res.status(401).json({
                message: 'Auth failed'
            });
        });
    /*******************************************
    * Returns signed JWT TOken
    *******************************************/
    // access_token = oAuthAccessToken.createAccessToken(user.email, user._id);
    // refresh_token = oAuthAccessToken.createRefreshToken(user.email, user._id);
    // console.log("TOKEN:", access_token);
    // return res.status(200).json({
    //     message: 'Auth successful',
    //     access_token: access_token,
    //     refresh_token: refresh_token,
    //     expiration: endTime.toString(),
    // });
}; // user_refreshToken

// let create_token = async (access_token, refresh_token, email) => {
//     await Token.create(
//         {
//             access: access_token,
//             refresh: refresh_token
//         }
//     ).then((dbToken) => {
//         // **Update and Return the User record that matches the email with 
//         // FindOneAndUpdate is atomic. If users are attempting to the
//         // update the db at the same time.  FIndAndUpdate will establish a lock on the record until it is complete.  HOwever, the display will not be updated until after
//         return User.findOneAndUpdate(
//             { email },
//             { token: dbToken._id },
//             {
//                 new: true,
//                 useFindAndModify: false
//             }
//         );
//     }).then((userDocument) => {
//         // user updated with token, send updated user to client

//         console.log("Should be true");
//         console.log(JSON.stringify(userDocument));
//         return JSON.stringify(userDocument);
//     }).catch((err) => {
//         // if user not updated send error to the client
//         // res.Json(err);
//         console.log("Should be true");
//         return false;
//     });
// };

exports.create_token = async (access_token, refresh_token, email) => {
    let dbToken = await Token.create(
        {
            access: access_token,
            refresh: refresh_token
        }
    );
    let userDocument =
        // **Update and Return the User record that matches the email with 
        // FindOneAndUpdate is atomic. If users are attempting to the
        // update the db at the same time.  FIndAndUpdate will establish a lock on the record until it is complete.  HOwever, the display will not be updated until after
        await User.findOneAndUpdate(
            { email },
            { token: dbToken._id },
            {
                new: true,
                useFindAndModify: false
            }
        );

    if (userDocument) {
        return true;
    }
    else
        return false;
};

// let populate_token = (email) => {
//     User.findOne({ email })
//         .populate("token")
//         .then((userDocument) => {
//             res.json(userDocument);
//         })
//         .catch(() => {
//             res.json(err);
//         });
// };

exports.users_get_user = async (req, res, next) => {
    let email = req.params.userEmail;
    User.findOne({ email })
        .populate("token")
        .then(userDocument => {
            console.log("USERCONTROLLER = ID:", userDocument._id, "Role", userDocument.role);
            res.status(200).json(userDocument);
        })
        .catch(() => {
            res.status(500).json(err);
        });
},
exports.populate_token = async (email) => {
    console.log("populate-Token email:", email);
    let userDocument = await User.findOne({ email }).populate("token");
    // console.log("USERDOC", userDocument);
    // return JSON.stringify(userDocument);
    return userDocument;
};

exports.user_login = async (req, res, next) => {

    let email = req.body.email;

    // Find the matching document in the user collection that matches the email
    User.findOne({ email })
        .then(async user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            } else {

                let endTime = oAuthAccessToken.getExpiration();
                /*************************************************************
                 * Check if password sent matches what was saved to database
                 **************************************************************/
                let passwordsEqual = await oAuthAccessToken.comparePasswords(req.body.password, user.password);

                console.log("Passwords Equal:", passwordsEqual);
                console.log("In comparePasswords");

                let access_token;
                let refresh_token;

                // if passwords Equal
                if (passwordsEqual) {
                    /*******************************************
                    * Returns signed JWT TOken
                    *******************************************/
                    // create access_token
                    access_token = oAuthAccessToken.createAccessToken(email, user._id);

                    // create refresh_token
                    refresh_token = oAuthAccessToken.createRefreshToken(email, user._id);

                    // 12/31/2019: Insert token on user document:
                    /*********************************/
                    let isTokenStored = await this.create_token(access_token, refresh_token, email);
                    console.log("is Token stored on USer: ", JSON.stringify(isTokenStored));
                    /*********************************/

                    if (isTokenStored) {
                    //     let popResponse = await populate_token(email);
                    //     console.log("RESPONSE: ", popResponse);
                    }

                    console.log("TOKEN:", access_token);
                    res.status(200).json({
                        message: 'Auth successful',
                        access_token: access_token,
                        refresh_token: refresh_token,
                        expiration: endTime.toString(),
                        email
                    });
                } // if
                // if passwords not Equal
                else {
                    // return res.status(401).json({message: 'Auth failed'});
                    console.log("in Password failed condition");
                    res.status(401).send({
                        message: 'Auth failed',
                        // access_token: access_token,
                        // refresh_token: refresh_token,
                        // expiration: endTime.toString(),
                        // email
                    });
                } // else
            } // else
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                message: err
            });
        });
};

exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "user deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        }); // catch
};
