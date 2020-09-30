const article = require("./article");
const carts = require("./carts");
const category = require("./category");
const itemsReview = require("./items_review");
const items = require("./items");
const pelapak = require("./pelapak");
const transaction = require("./transaction");
const users_profiles = require("./user_profiles");
const roles = require("./user_roles");
const users_vc = require("./user_vc");
const users = require("./users");

module.exports = {
  tables: [...article.Tables, ...carts.Tables, ...category.Tables, ...itemsReview.Tables, ...items.Tables, ...pelapak.Tables, ...transaction.Tables, ...users_profiles.Tables, ...roles.Tables, ...users_vc.Tables, ...users.Tables],

  relation: [...article.Relations, ...carts.Relations, ...category.Relations, ...itemsReview.Relations, ...items.Relations, ...pelapak.Relations, ...transaction.Relations, ...users_profiles.Relations, ...roles.Relations, ...users_vc.Relations, ...users.Relations],
};