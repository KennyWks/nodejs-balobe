const articleTable = `
CREATE TABLE IF NOT EXISTS articles(
    id_article INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_category INT(11) UNSIGNED,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)`;

const articleRelation = `
ALTER TABLE articles
    ADD CONSTRAINT fk_category_articles
    FOREIGN KEY (id_category) REFERENCES category(id_category)
    ON DELETE SET NULL
`;
exports.Tables = [articleTable];
exports.Relations = [articleRelation];