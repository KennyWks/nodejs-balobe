const transactionTable = `
CREATE TABLE IF NOT EXISTS transaction(
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_user INT(11) UNSIGNED,
    id_pelapak INT(11) UNSIGNED,
    list_item INT(11) UNSIGNED,
    total_item INT(11) NOT NULL,    
    total_price INT(11) NOT NULL,    
    courier INT(11) NOT NULL,    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

const transactionRelation = `
ALTER TABLE transaction
    ADD CONSTRAINT fk_users_transaction
    FOREIGN KEY (id_user) REFERENCES users(id_user)
    ON DELETE SET NULL;
ALTER TABLE transaction
    ADD CONSTRAINT fk_item_transaction
    FOREIGN KEY (list_item) REFERENCES items(id_item)
    ON DELETE SET NULL
`;
exports.Tables = [transactionTable];
exports.Relations = [transactionRelation];
