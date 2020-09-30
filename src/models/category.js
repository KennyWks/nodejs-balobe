const {
    runQuery
} = require("../config/db");

exports.CreateCategoryModel = (hs_code, name) => {
    return new Promise((resolve, reject) => {
        runQuery(`
INSERT INTO category(hs_code,name) values('${hs_code}','${name}')`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

exports.GetAllCategoryModel = (params) => {
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
        SELECT COUNT(*) AS total FROM category ${condition.substring(0,  condition.indexOf("LIMIT"))};
        SELECT * FROM category ${condition}
        `, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.GetDetailCategoryModel = (id_category) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM category WHERE id_category=${id_category}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.UpdateCategoryModel = (id_category, body) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM category WHERE id_category=${id_category}`, (err, result) => {
            if (err || !result[1][0]) {
                return reject(new Error(`catergory with id : ${id_category} not exists`));
            }
            runQuery(`UPDATE category SET ${Object.keys(body).map((v) => `${v} = '${body[v]}'`).join(",")} WHERE id_category=${id_category}`, (err, result) => {
                if (err) {
                    return reject(new Error(err));
                }
                return resolve(result);
            });
        });
    });
}

exports.DeleteCategoryModel = (id_category) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM category WHERE id_category=${id_category}`, (err, result) => {
            if (err || !result[1][0]) {
                return reject(new Error(`catergory with id : ${id_category} not exists`));
            }
            runQuery(`DELETE FROM category WHERE id_category=${id_category}`, (err, result) => {
                if (err) {
                    return reject(new Error(err));
                }
                return resolve(result);
            });
        });
    });
}