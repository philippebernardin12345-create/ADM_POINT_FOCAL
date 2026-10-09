const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");

const root = path.join(__dirname, "..");

test("admin dashboard provides a statistics anchor and a logout button", () => {
  for (const filename of ["dashboard-admin.html", "dashboard-admin-20261009-v3.html"]) {
    const html = fs.readFileSync(path.join(root, filename), "utf8");
    assert.match(html, /id="statistics"/);
    assert.match(html, /href="#statistics"[\s\S]*?Statistiques/);
    assert.match(html, /id="logoutButton"/);
    assert.match(html, /logoutButton"[\s\S]*?addEventListener\("click", logoutAdmin\)/);
  }
});

test("logout clears the admin token and profile, then returns to admin login", () => {
  const source = fs.readFileSync(path.join(root, "admin.js"), "utf8");
  const operations = [];
  const context = {
    localStorage: {
      removeItem(key) { operations.push(["remove", key]); }
    },
    window: {
      location: {
        replace(url) { operations.push(["redirect", url]); }
      }
    },
    console
  };

  vm.runInNewContext(source + "\nlogoutAdmin();", context);

  assert.deepEqual(operations, [
    ["remove", "point_focal_admin_token"],
    ["remove", "point_focal_admin_user"],
    ["redirect", "login-admin-20261009-v3.html"]
  ]);
});
