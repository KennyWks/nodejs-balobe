const {
    runQuery
} = require("../config/db");

exports.CreateCartsModel = (data) => {
    return new Promise((resolve, reject) => {
        runQuery(`
INSERT INTO carts(id_user,id_item,id_pelapak,total_item,total_price,is_check_out) values('${data.id_user}','${data.id_item}','${data.id_pelapak}','${data.total_item}','${data.total_price}','${data.is_check_out}')`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

exports.GetAllCartsModel = (params, id_user) => {
    return new Promise((resolve, reject) => {
        const {
            limit,
            page,
            sort,
            search
        } = params;

        const condition = `
            ${search ? `&& name_item LIKE '%${search}%'` : ``}
            ${sort ? `ORDER BY ${sort.key} ${sort.value}` : `` } LIMIT ${parseInt(limit)} OFFSET ${parseInt(page) - 1}`;

        const join = `
                    JOIN items
                    ON items.id_item = carts.id_item
                    JOIN pelapak
                    ON pelapak.id_pelapak = carts.id_pelapak
                    `;

        const select = "`id`.`carts`, `id_user`.`carts`, `id_item`.`carts`, `total_item`.`carts`, `total_price`.`carts`, `name`.`items` as name_item, `price`.`items`, `image`.`items`, `name`.`pelapak` as name_pelapak";

        runQuery(`
            SELECT COUNT(*) AS total FROM carts WHERE id_user=${id_user} ${condition.substring(0,  condition.indexOf("LIMIT"))};
            SELECT ${select} FROM carts ${join} WHERE id_user=${id_user} && is_check_out = 0 ${condition}
            `, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}


exports.GetDetailCartsModel = (id_carts) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM carts WHERE id=${id_carts}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.CheckOutModel = (id_carts, data) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM carts WHERE id=${id_carts}`, (err, result) => {
            if (err || !result[1][0]) {
                return reject(new Error(`carts with id : ${id_carts} not exists`));
            }
            runQuery(`UPDATE carts SET is_check_out = 1 WHERE id = ${id_carts}`, (err, result) => {
                if (err) {
                    return reject(new Error(err));
                }
                runQuery(`INSERT INTO transaction(id_user,list_item,total_item,total_price) values('${data.id_user}','${data.list_item}','${data.total_item}','${data.total_price}')`, (err, result) => {
                    if (err) {
                        return reject(new Error(err));
                    }
                    return resolve(result);
                });
            });
        });
    });
}