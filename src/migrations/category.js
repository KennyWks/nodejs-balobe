const categoryTable = `
CREATE TABLE IF NOT EXISTS category(
    id_category INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    hs_code INT(3) UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL
)`;

exports.Tables = [categoryTable];
exports.Relations = [];