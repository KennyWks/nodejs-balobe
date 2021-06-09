const itemsReviewTable = `
CREATE TABLE IF NOT EXISTS items_review(
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_user INT(11) UNSIGNED,
    id_item INT(11) UNSIGNED,
    id_pelapak INT(11) UNSIGNED,
    rating INT(1) NOT NULL,
    review TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)`;

const itemsReviewRelation = `
ALTER TABLE items_review
    ADD CONSTRAINT fk_users_review
    FOREIGN KEY (id_user) REFERENCES users(id_user)
    ON DELETE SET NULL;
ALTER TABLE items_review
    ADD CONSTRAINT fk_pelapak_review
    FOREIGN KEY (id_pelapak) REFERENCES pelapak(id_pelapak)
    ON DELETE SET NULL;
ALTER TABLE items_review
    ADD CONSTRAINT fk_item_review
    FOREIGN KEY (id_item) REFERENCES items(id_item)
    ON DELETE SET NULL
`;
exports.Tables = [itemsReviewTable];
exports.Relations = [itemsReviewRelation];
