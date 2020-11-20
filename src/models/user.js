const {
    runQuery
} = require("../config/db");

exports.UpdateImageProfileUserModel = (path, id_user) => {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE user_profiles SET picture='${path}' WHERE id_user=${id_user}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.GetDataUserProfiles = (id_user) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM user_profiles WHERE id_user=${id_user}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.GetDataUser = (id_user) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM users WHERE id_user=${id_user}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.UpdateProfileUserModel = (id_user, body) => {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE user_profiles SET ${Object.keys(body).map((v) => `${v} = '${body[v]}'`).join(",")} WHERE id_user=${id_user}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.GetAllUserModel = (params) => {
    return new Promise((resolve, reject) => {
        const {
            limit,
            page,
            sort,
            search
        } = params;
        const condition = `
        ${search ? `WHERE username LIKE '%${search}%'` : ""}
        ${sort ? `ORDER BY ${sort.key} ${sort.value}` : "" } LIMIT ${parseInt(limit)} OFFSET ${parseInt(page) - 1}`;
        runQuery(`
        SELECT COUNT(*) AS total FROM users ${condition.substring(0,  condition.indexOf("LIMIT"))};
        SELECT * FROM users ${condition}
        `, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}
