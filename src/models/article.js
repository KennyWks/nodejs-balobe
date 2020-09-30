const {
  runQuery
} = require("../config/db");

exports.CreateArticleModel = (data) => {
  return new Promise((resolve, reject) => {
    runQuery(`
INSERT INTO articles(id_category, name, description, image) values('${data.id_category}','${data.name}','${data.description}','${data.image}')`, (err, result) => {
      if (err) {
        return reject(new Error(err));
      }
      return resolve(result);
    });
  });
};

exports.GetAllArticleModel = (params) => {
  return new Promise((resolve, reject) => {
    const {
      limit,
      page,
      sort,
      search
    } = params;
    const condition = `
      ${search ? `WHERE name LIKE '%${search}%'` : ""}
      ${sort ? `ORDER BY ${sort.key} ${sort.value}` : "" } LIMIT ${parseInt(limit)} OFFSET ${parseInt(page) - 1}`;
    runQuery(`
      SELECT COUNT(*) AS total FROM articles ${condition.substring(0,  condition.indexOf("LIMIT"))};
      SELECT * FROM articles ${condition}
      `, (err, result) => {
      if (err) {
        return reject(new Error(err));
      }
      return resolve(result);
    });
  });
}

exports.GetDetailArticleModel = (id_article) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT * FROM articles WHERE id_article=${id_article}`, (err, result) => {
      if (err) {
        return reject(new Error(err));
      }
      return resolve(result);
    });
  });
}

exports.UpdateArticleModel = (id_article, body, path) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT * FROM articles WHERE id_article=${id_article}`, (err, result) => {
      if (err || !result[1][0]) {
        return reject(new Error(`article with id : ${id_article} not exists`));
      }
      runQuery(`UPDATE articles SET ${Object.keys(body).map((v) => `${v} = '${body[v]}'`).join(",")} WHERE id_article=${id_article}`, (err, result) => {
        if (err) {
          return reject(new Error(err));
        }
        runQuery(`UPDATE articles SET image = '${path}' WHERE id_article=${id_article}`, (err, result) => {
          if (err) {
            return reject(new Error(err));
          }
          return resolve(result);
        });
      });
    });
  });
}

exports.DeleteArticleModel = (id_article) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT * FROM articles WHERE id_article=${id_article}`, (err, result) => {
      if (err || !result[1][0]) {
        return reject(new Error(`articles with id : ${id_article} not exists`));
      }
      runQuery(`DELETE FROM articles WHERE id_article=${id_article}`, (err, result) => {
        if (err) {
          return reject(new Error(err));
        }
        return resolve(result);
      });
    });
  });
}