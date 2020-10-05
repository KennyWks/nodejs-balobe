const uservcTable = `
CREATE TABLE IF NOT EXISTS user_vc(
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_user INT(11) UNSIGNED,
    verify_code VARCHAR(255),
    vc_for INT(1) UNSIGNED,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;

const uservcRelations = `
    ALTER TABLE user_vc
        ADD CONSTRAINT fk_iduser1
        FOREIGN KEY (id_user) REFERENCES users(id_user)
        ON DELETE SET NULL
    `;
exports.Tables = [uservcTable];
exports.Relations = [uservcRelations];