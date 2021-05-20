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
        
        const join = `
                    JOIN user_profiles
                    ON user_profiles.id_user = users.id_user
                    `;
                    
        const select = "`users`.`id_user`, `user_profiles`.`fullname`, `user_profiles`.`gender`, `user_profiles`.`picture`, `user_profiles`.`address`, `user_profiles`.`email`, `user_profiles`.`phone`, `user_profiles`.`balance`, `users`.`status`";

        runQuery(`
        SELECT COUNT(*) AS total FROM users ${join} ${condition.substring(0,  condition.indexOf("LIMIT"))};
        SELECT ${select} FROM users ${join} ${condition}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}
