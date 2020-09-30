const {
    runQuery
} = require("../config/db");

exports.CreatePelapakModel = (data) => {
    return new Promise((resolve, reject) => {
        runQuery(`
INSERT INTO pelapak(id_owner, name, logo, description, location) values('${data.id_owner}','${data.name}', '${data.logo}', '${data.description}', '${data.location}')`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

exports.GetDetailPelapakModel = (id_pelapak) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM pelapak WHERE id_pelapak=${id_pelapak}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.UpdatePelapakModel = (id_pelapak, body) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM pelapak WHERE id_pelapak=${id_pelapak}`, (err, result) => {
            if (err || !result[1][0]) {
                return reject(new Error(`pelapak with id : ${id_pelapak} not exists`));
            }
            runQuery(`UPDATE pelapak SET ${Object.keys(body).map((v) => `${v} = '${body[v]}'`).join(",")} WHERE id_pelapak=${id_pelapak}`, (err, result) => {
                if (err) {
                    return reject(new Error(err));
                }
                return resolve(result);
            });
        });
    });
}

exports.UpdateFotoItemModel = (path, id_pelapak) => {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE pelapak SET logo='${path}' WHERE id_pelapak=${id_pelapak}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.GetAllPelapakModel = (params) => {
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
        SELECT COUNT(*) AS total FROM pelapak ${condition.substring(0,  condition.indexOf("LIMIT"))};
        SELECT * FROM pelapak ${condition}
        `, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}