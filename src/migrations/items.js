const itemsTable = `
CREATE TABLE IF NOT EXISTS items(
    id_item INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_pelapak INT(11) UNSIGNED,
    id_category INT(11) UNSIGNED,
    name VARCHAR(100) NOT NULL,
    price INT(11) NOT NULL,
    quantity INT(11) NOT NULL,
    description TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)`;

const itemsRelation = `
ALTER TABLE items
    ADD CONSTRAINT fk_category_items
    FOREIGN KEY (id_category) REFERENCES category(id_category)
    ON DELETE SET NULL;
ALTER TABLE items
    ADD CONSTRAINT fk_pelapak
    FOREIGN KEY (id_pelapak) REFERENCES pelapak(id_pelapak)
    ON DELETE SET NULL
`;
exports.Tables = [itemsTable];
exports.Relations = [itemsRelation];