const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');


exports.getHash = ((password, salt) => {
    return new Promise((resolve, reject) => {
        console.log("IN PROMISE");
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                // console.log('Err:', err);
                reject(err);
            }
            else {
                // console.log('Hash:', hash);
                resolve(hash);
            }
        }); // bcrypt
    });  // promise 
});

exports.comparePasswords = ((inputPassword, storedPassword) => {
    return new Promise((resolve, reject) => {
        console.log("IN PROMISE");
        bcrypt.compare(inputPassword, storedPassword, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        }); // bcrypt
    });  // promise  
});

const accessExpire = 1;

// Create a new access_token
exports.createAccessToken = (email, id) => {
    return jwt.sign(
        {
            email: email,
            userId: id
        },
        process.env.JWT_PRIVATE_KEY,
        {
            expiresIn: `${accessExpire}h`
        }
    );
};

// Create a new access_token
exports.createRefreshToken = (email, id) => {
    return jwt.sign(
        {
            email: email,
            userId: id
        },
        process.env.JWT_PRIVATE_KEY,
        {
            expiresIn: `${5 * accessExpire}h`
        }
    );
};

// Parse token
exports.verify = (token) => {
    return jwt.verify(token, process.env.JWT_PRIVATE_KEY);
};

exports.decode = (token) => {
    return jwt.decode(token, process.env.JWT_PRIVATE_KEY);
};

// get token expiration
exports.getExpiration = () => {
    // let time = moment().format('MM-DD-YYYY HH:mm:ss');
    // let time = moment();
    let time = moment.utc();
    console.log('time:', time);

    // let startTime = moment(time);
    let startTime = moment.utc(time);

    // let endTime = moment(startTime).add(1, 'hours');
    // let endTime = moment.utc(startTime).add(1, 'hours');
    let endTime = startTime.add(1, 'hours');
    console.log('startTime:', startTime, 'endTime:', endTime);

    // let diff = endTime.diff(startTime, 'hours');
    // console.log('Dif:', diff);
    return endTime;
};