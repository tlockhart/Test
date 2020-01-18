const oAuthAccessToken = require('../generators/oAuthAccessToken');
const userController = require('../../../controllers/user');

const jwt = require('jsonwebtoken');
// const populate_token = require('../../../controllers/user')



// Add the following JWT middleware to the routes we wish to authenticate.
module.exports = async (req, res, next) => {


    // Step1: call next() if we did successfully authenticate
    // verify and return decoded value
    /************************************/
    console.log("CHECKAUTH req BODY Data: ", req.body);
    console.log("CHECKAUTH req Head: ", req.headers);


    /************************************/
    // console.log("Expired", req.body.expired);

    try {
        //01/01/2020: Get the data from the object array 
        /************************************/
        let isArrayResponse = false;
        let arrayResExpired;
        let arrayResEmail;
        let expired;
        let email;
        let userAuthToken;
        const updateProps = {};
        if (req.body) {
            // 01/01/2019: if response is not an array (Delete, View)
            /***********************************/
            if (req.body.email) {
                console.log("******NOT AN ARRAY*****");
                expired = req.body.expired;
                email = req.body.email;
                console.log(`Email: ${email}, Expired: ${expired}`);
            }
            // 01/01/2019: Array: if the response is an array of elements
            /***********************************/
            else {
                console.log("******IS AN ARRAY*****");
                for (let key of req.body) {
                    // validate that data has been supplied
                    console.log("Key:", key);
                    if (key.value !== undefined) {
                        updateProps[key.propName] = key.value;
                        if (key.propName === "email") {
                            arrayResEmail = key.value;
                            console.log("UPDATEmail:", arrayResEmail);
                        }
                        else if (key.propName === "expired") {
                            arrayResExpired = key.value;
                            console.log("UPDATExpired", arrayResExpired);
                        }
                    }
                } // for

                console.log("Email:", arrayResEmail, "Expired:", arrayResExpired);
                isArrayResponse = true;
            }// else is array

        } // if req.body

        // 01/01/2020: check for an update expired or an insert expired. Set the Values for Array Input or Regular Input
        /*************************************/
        if (isArrayResponse) {
            expired = arrayResExpired;
            email = arrayResEmail;
            console.log("ARRAY INPUT: Expired:", expired, "Email: ", email);
        }
        else {
            console.log("REGULAR INPUT: Expired", expired);
            // expired = res.body.expired;
            // email = res.body.email; 
            console.log("UPDATE Expired:", expired, "UPDATE Email: ", email);
        }

        /******************************************/

        let decoded;
        // console.log("REQ:",req);
        const refresh_token_header = req.headers.refreshtoken;
        const access_token_header = req.headers.authorization;

        console.log('check-auth:refresh_token_header: ', refresh_token_header, 'isrefreshEqNoRefresh', refresh_token_header === 'norefresh');
        console.log('check-auth:access_token_header: ', access_token_header);
        console.log('check-auth:expired: ', expired, 'isTrue', expired === true);

        // 01/01/2019: Pull the User record 
        let userDocument = await userController.populate_token(email);

        console.log("CHECKAUTH USERDOCUMENT Access: ", userDocument.token.access, "refresh: ", userDocument.token.refresh);

        // 01/01/2019: No-Refresh: Access Token has not expired, before we perform an update in the db, make sure the access_tokens match the access_token on the user record
        /******************************/
        if (email) {
            // Populate Token:

            userAuthToken = "Bearer " + userDocument.token.access;


            if (access_token_header === userAuthToken) {
                console.log("Access_token_header = userAuthToken");

                // Check if the Access_TOken is valid
                this.isAccessTokenValid(access_token_header, refresh_token_header);
            }
        }
        /******************************/
        // REFRESH: When a refresh is needed time has expired, refreshtoken and accesstoken sent in the header.  Verify the refresh_token_header
        // Note: The if the refresh token has expired the user will have to relogin (5hs)
        else if (expired === true) {
            userRefreshToken = userDocument.token.refresh;
            // Does refreshToken in header match user RefreshToken?
            if (refresh_token_header == userRefreshToken) {
                console.log("Refresh_token_header = userRefreshToken");

                //01012020: Validate if refreshToken valid
                this.isRefreshTokenValid(refresh_token_header, expired);
            }


        }
        // NO-REFRESH: If time has not expired then the refresh_token is set to norefresh and tokens are sent in the header
        // else if (refresh_token_header === 'norefresh' && access_token_header) {
        //     console.log("check-auth: valid access_token_header refresh_token_header norefresh: ELSE IF2");
        //     const access_token = access_token_header.split(' ')[1];

        //     // console.log("SPLIT", access_token);
        //     decoded = oAuthAccessToken.verify(access_token, process.env.JWT_PRIVATE_KEY);
        //     console.log("CheckAuth: Refresh Token verified");
        // }
        else {
            console.log("check-auth: refresh_token: ELSE");
            // throw new Error("Unauthorized Use");
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        next();
    }
    catch (error) {
        console.log("check-auth: No condition met");
        return res.status(401).json({
            message: 'Auth failed'
        });
    }// catch
};

exports.isAccessTokenValid = (access_token_header, refresh_token_header) => {
    console.log("isAccessTokenValid");
    if (refresh_token_header === 'norefresh' && access_token_header) {
        console.log("check-auth: valid access_token_header refresh_token_header norefresh: ELSE IF2");
        const access_token = access_token_header.split(' ')[1];

        // console.log("SPLIT", access_token);
        decoded = oAuthAccessToken.verify(access_token, process.env.JWT_PRIVATE_KEY);
        console.log("CheckAuth: Refresh Token verified");
    }
};// isAccessTokenValid

exports.isRefreshTokenValid = (refresh_token_header, expired) => {
    decoded = oAuthAccessToken.verify(refresh_token_header, process.env.JWT_PRIVATE_KEY);
    console.log("CheckAuth: Refresh Token verified: IF: EXPIRED =", expired);
};