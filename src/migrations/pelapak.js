const pelapakTable = `
CREATE TABLE IF NOT EXISTS pelapak(
    id_pelapak INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_owner INT(11) UNSIGNED,
    name TEXT NOT NULL,
    logo TEXT,
    description TEXT NOT NULL,
    id_location INT(11) UNSIGNED,
    location TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)`;

const pelapakRelations = `
    ALTER TABLE pelapak
        ADD CONSTRAINT fk_owner
        FOREIGN KEY (id_owner) REFERENCES users(id_user)
        ON DELETE SET NULL
    `;

exports.Tables = [pelapakTable];
exports.Relations = [pelapakRelations];