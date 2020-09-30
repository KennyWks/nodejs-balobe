const userProfilesTable = `
CREATE TABLE IF NOT EXISTS user_profiles(
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_user INT(11) UNSIGNED,
    fullname TEXT NOT NULL,
    gender TEXT,
    picture TEXT,
    address TEXT NOT NULL,
    email TEXT,
    phone VARCHAR(20) NOT NULL,
    balance INT(11),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)`;

const userProfilesRelations = `
    ALTER TABLE user_profiles
        ADD CONSTRAINT fk_iduser2
        FOREIGN KEY (id_user) REFERENCES users(id_user)
        ON DELETE SET NULL
    `;

exports.Tables = [userProfilesTable];
exports.Relations = [userProfilesRelations];