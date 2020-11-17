const {
    runQuery
} = require("../config/db");

exports.CreateItemModel = (data) => {
    return new Promise((resolve, reject) => {
        runQuery(`
INSERT INTO items(id_pelapak,id_category,name,price,quantity,description,image) values('${data.id_pelapak}', '${data.id_category}', '${data.name}', '${data.price}', '${data.quantity}', '${data.description}','${data.image}')`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

exports.GetAllItemModel = (params) => {
    const join = '`items`.`id_item`=`items_review`.`id_item`';
    const all = '`items`.`id_item`, `items`.`id_pelapak`, `items`.`id_category`, `items`.`name`, `items`.`price`, `items`.`quantity`, `items`.`weight`, `items`.`description`, `items`.`image`, `items_review`.`id_item`, `items_review`.`id_user`, `items_review`.`rating`, `items_review`.`review`';
    
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
        SELECT COUNT(${all}) AS total FROM items LEFT JOIN items_review ON ${join} UNION SELECT ${all} FROM items RIGHT JOIN items_review ON ${join} ${condition.substring(0,  condition.indexOf("LIMIT"))};
        SELECT ${all} FROM items LEFT JOIN items_review ON ${join} UNION SELECT ${all} FROM items RIGHT JOIN items_review ON ${join} ${condition}
        `, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.GetDetailItemModel = (id_item) => {
    return new Promise((resolve, reject) => {
        runQuery('SELECT `items`.`id_item`, `items`.`id_pelapak`, `items`.`id_category`, `items`.`name` as name_product, `items`.`price`, `items`.`quantity`, `items`.`weight`, `items`.`description`, `items`.`image`, `items`.`created_at`, `items`.`updated_at`, `category`.`hs_code`, `category`.`name` as name_category, `pelapak`.`name` as name_pelapak, `pelapak`.`logo`, `pelapak`.`description` as desc_pelapak, `pelapak`.`location` FROM items JOIN category ON `items`.`id_category` = `category`.`id_category` JOIN pelapak ON `items`.`id_pelapak` = `pelapak`.`id_pelapak` WHERE id_item = ' +id_item, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.UpdateItemModel = (id_item, body) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM items WHERE id_item=${id_item}`, (err, result) => {
            if (err || !result[1][0]) {
                return reject(new Error(`item with id : ${id_item} not exists`));
            }
            runQuery(`UPDATE items SET ${Object.keys(body).map((v) => `${v} = '${body[v]}'`).join(",")} WHERE id_item=${id_item}`, (err, result) => {
                if (err) {
                    return reject(new Error(err));
                }
                return resolve(result);
            });
        });
    });
}

exports.DeleteItemModel = (id_item) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM items WHERE id_item=${id_item}`, (err, result) => {
            if (err || !result[1][0]) {
                return reject(new Error(`item with Id : ${id_item} not exists`));
            }
            runQuery(`DELETE FROM items WHERE id_item=${id_item}`, (err, result) => {
                if (err) {
                    return reject(new Error(err));
                }
                return resolve(result);
            });
        });
    });
}


exports.GetDataItem = (id_item) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM items WHERE id_item=${id_item}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.UpdateImageItemModel = (path, id_item) => {
    return new Promise((resolve, reject) => {
        runQuery(`UPDATE items SET image='${path}' WHERE id_item=${id_item}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.CreateReviewItemModel = (data) => {
    return new Promise((resolve, reject) => {
        runQuery(`
INSERT INTO items_review(id_user,id_item,rating,review) values('${data.id_user}', '${data.id_item}', '${data.rating}', '${data.review}')`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
};

exports.UpdateReviewItemModel = (id, body) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM items_review WHERE id=${id}`, (err, result) => {
            if (err || !result[1][0]) {
                return reject(new Error(`items review with id : ${id} not exists`));
            }
            runQuery(`UPDATE items_review SET ${Object.keys(body).map((v) => `${v} = '${body[v]}'`).join(",")} WHERE id=${id}`, (err, result) => {
                if (err) {
                    return reject(new Error(err));
                }
                return resolve(result);
            });
        });
    });
}

exports.GetReviewByUserModel = (id_user) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM items_review WHERE id_user=${id_user}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.GetReviewByIdModel = (id) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM items_review WHERE id=${id}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.GetReviewByIdItemModel = (id_item) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM items_review WHERE id_item=${id_item}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}

exports.GetAllReviewModel = (params) => {
    return new Promise((resolve, reject) => {
        const {
            limit,
            page,
            sort,
            search
        } = params;
        const condition = `
        ${search ? `WHERE review LIKE '%${search}%'` : ""}
        ${sort ? `ORDER BY ${sort.key} ${sort.value}` : "" } LIMIT ${parseInt(limit)} OFFSET ${parseInt(page) - 1}`;
        runQuery(`
        SELECT COUNT(*) AS total FROM items_review ${condition.substring(0,  condition.indexOf("LIMIT"))};
        SELECT * FROM items_review ${condition}
        `, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}