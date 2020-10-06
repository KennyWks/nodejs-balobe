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

exports.GetEmailSignupModel = (email) => {
    return new Promise((resolve, reject) => {
        runQuery(`
        SELECT users.*, user_profiles.* FROM users JOIN user_profiles ON users.id_user = user_profiles.id_user WHERE user_profiles.email = '${email}'`, (err, result) => {
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

// model for check verify code for acoount from user vc
exports.GetVerifyCodeAccountModel = (verifyCode) => {
    return new Promise((resolve, reject) => {
        runQuery(`
SELECT * FROM user_vc WHERE verify_code='${verifyCode}' AND vc_for=1`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

// model for delete data from table users & user_vc if link is expired
exports.ExpiredLinkConfirmAccoutModel = (id_user) => {
    return new Promise((resolve, reject) => {
        runQuery(`DELETE FROM user_vc WHERE id_user=${id_user} AND vc_for=1`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            runQuery(`DELETE FROM user_profiles WHERE id_user=${id_user}`, (err, result) => {
                if (err) {
                    return reject(new Error(err));
                }
                runQuery(`DELETE FROM users WHERE id_user=${id_user}`, (err, result) => {
                    if (err) {
                        return reject(new Error(err));
                    }
                    return resolve(result);
                });
            });
        });
    });
}

// model for check verify code for change password from user vc
exports.GetVerifyCodePassModel = (verifyCode) => {
    return new Promise((resolve, reject) => {
        runQuery(`
SELECT * FROM user_vc WHERE verify_code='${verifyCode}' AND vc_for=2`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

//delete data user in table verify code
//update data status user in table user
exports.FinishConfirmAccountModel = (id_user) => {
    return new Promise((resolve, reject) => {
        runQuery(`DELETE FROM user_vc WHERE id_user=${id_user} AND vc_for=1`, (err, result) => {
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

exports.ExpiredLinkUpdatePassModel = (id_user) => {
    return new Promise((resolve, reject) => {
        runQuery(`DELETE FROM user_vc WHERE id_user=${id_user} AND vc_for=2`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.ChangePasswordModel = (id_user, hashPassword) => {
    return new Promise((resolve, reject) => {
        runQuery(`DELETE FROM user_vc WHERE id_user=${id_user} AND vc_for=2`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            runQuery(`UPDATE users SET password='${hashPassword}' WHERE id_user=${id_user}`, (err, result) => {
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

//insert data for table verify code (confirm account)
exports.CreateVcForConfirmModel = (dataUserVC) => {
    return new Promise((resolve, reject) => {
        runQuery(`
INSERT INTO user_vc(id_user,verify_code,vc_for) values('${dataUserVC.id_user}', '${dataUserVC.verify_code}', '${dataUserVC.vc_for}')`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

//insert data for table verify code (forgot password)
exports.CreateVcForForgetPassModel = (dataUserVC) => {
    return new Promise((resolve, reject) => {
        runQuery(`
INSERT INTO user_vc(id_user,verify_code,vc_for) values('${dataUserVC.id_user}', '${dataUserVC.verify_code}', '${dataUserVC.vc_for}')`, (err, result) => {
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