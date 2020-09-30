const {
    runQuery
} = require("../config/db");

exports.CreateRoleModel = (name) => {
    return new Promise((resolve, reject) => {
        runQuery(`
INSERT INTO user_roles(name) values('${name}')`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

exports.GetAllRoleModel = (params) => {
    return new Promise((resolve, reject) => {
        const {
            limit,
            page,
            sort,
            search
        } = params;
        
        const condition = `
        ${search ? `WHERE name LIKE '%${search}%'` : ""}
        ${sort ? `ORDER BY ${sort.key} ${sort.value}` : "" } LIMIT ${parseInt(limit)} OFFSET ${parseInt(page) - 1}`;
        runQuery(`
        SELECT COUNT(*) AS total FROM user_roles ${condition.substring(0,  condition.indexOf("LIMIT"))};
        SELECT * FROM user_roles ${condition}
        `, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.GetDetailRoleModel = (role_id) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM user_roles WHERE role_id=${role_id}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.UpdateRoleModel = (role_id, body) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM user_roles WHERE role_id=${role_id}`, (err, result) => {
            if (err || !result[1][0]) {
                return reject(new Error(`role with id : ${role_id} not exists`));
            }
            runQuery(`UPDATE user_roles SET ${Object.keys(body).map((v) => `${v} = '${body[v]}'`).join(",")} WHERE role_id=${role_id}`, (err, result) => {
                if (err) {
                    return reject(new Error(err));
                }
                return resolve(result);
            });
        });
    });
}

exports.DeleteRoleModel = (role_id) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM user_roles WHERE role_id=${role_id}`, (err, result) => {
            if (err || !result[1][0]) {
                return reject(new Error(`role with id : ${role_id} not exists`));
            }
            runQuery(`DELETE FROM user_roles WHERE role_id=${role_id}`, (err, result) => {
                if (err) {
                    return reject(new Error(err));
                }
                return resolve(result);
            });
        });
    });
}