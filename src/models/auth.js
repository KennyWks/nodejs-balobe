const {
    runQuery
} = require("../config/db");

// check username if exist or not for signup
exports.GetUsernameSignupModel = (username) => {
    return new Promise((resolve, reject) => {
        runQuery(`
SELECT * FROM users WHERE username='${username}'`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

// model for check username from user vc
exports.GetIdUserModel = (id_user) => {
    return new Promise((resolve, reject) => {
        runQuery(`
SELECT * FROM user_vc WHERE id_user='${id_user}'`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

// model for check verify code from user vc
exports.GetVerifyCodeModel = (verifyCode) => {
    return new Promise((resolve, reject) => {
        runQuery(`
SELECT * FROM user_vc WHERE verify_code='${verifyCode}'`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

//delete data user in table verify code
//update data status user in table user
exports.FinishConfirm = (id_user) => {
    return new Promise((resolve, reject) => {
        runQuery(`DELETE FROM user_vc WHERE id_user=${id_user}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            runQuery(`UPDATE users SET status=1 WHERE id_user=${id_user}`, (err, result) => {
                if (err) {
                    return reject(new Error(err));
                }
                return resolve(result);
            });
        });
    });
}

//insert data for table user
exports.UserModel = (dataUser) => {
    return new Promise((resolve, reject) => {
        runQuery(`
INSERT INTO users(username,password,status,role_id) values('${dataUser.username}', '${dataUser.password}', '${dataUser.status}',  '${dataUser.role_id}')`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

//insert data for table user profiles
exports.UserProfilesModel = (dataUserProfiles) => {
    return new Promise((resolve, reject) => {
        runQuery(`
INSERT INTO user_profiles(id_user,fullname,gender,picture,address,email,phone,balance) values('${dataUserProfiles.id_user}', '${dataUserProfiles.fullname}', '${dataUserProfiles.gender}',  '${dataUserProfiles.picture}',  '${dataUserProfiles.address}',  '${dataUserProfiles.email}',  '${dataUserProfiles.phone}',  '${dataUserProfiles.balance}')`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

//insert data for table verify code
exports.UserVC = (dataUserVC) => {
    return new Promise((resolve, reject) => {
        runQuery(`
INSERT INTO user_vc(id_user,verify_code) values('${dataUserVC.id_user}', '${dataUserVC.verify_code}')`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

// check username if exist or not for login
exports.GetUserDataLoginModel = (username) => {
    return new Promise((resolve, reject) => {
        runQuery(`
SELECT * FROM users WHERE username='${username}'`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};