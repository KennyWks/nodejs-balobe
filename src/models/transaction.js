const {
    runQuery
} = require("../config/db");

exports.GetUserTransactionModel = (id_user) => {
    return new Promise((resolve, reject) => {
        runQuery(`SELECT * FROM transaction WHERE id_user=${id_user}`, (err, result) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve(result);
        });
    });
}