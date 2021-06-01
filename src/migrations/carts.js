const cartsTable = `
CREATE TABLE IF NOT EXISTS carts(
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_user INT(11) UNSIGNED,
    id_item INT(11) UNSIGNED,
    id_pelapak INT(11) UNSIGNED,
    total_item INT(11) NOT NULL,    
    total_price INT(11) NOT NULL,    
    courier INT(11) NOT NULL,    
    is_check_out INT(1) NOT NULL,    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)`;

const cartsRelation = `
ALTER TABLE carts
    ADD CONSTRAINT fk_users_carts
    FOREIGN KEY (id_user) REFERENCES users(id_user)
    ON DELETE SET NULL;
ALTER TABLE carts
    ADD CONSTRAINT fk_pelapak_carts
    FOREIGN KEY (id_pelapak) REFERENCES pelapak(id_pelapak)
    ON DELETE SET NULL;
ALTER TABLE carts
    ADD CONSTRAINT fk_item_carts
    FOREIGN KEY (id_item) REFERENCES items(id_item)
    ON DELETE SET NULL
`;
exports.Tables = [cartsTable];
exports.Relations = [cartsRelation];
