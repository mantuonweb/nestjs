db = db.getSiblingDB('admin');
db.createUser({
  user: 'root',
  pwd: 'example',
  roles: ['root']
});

// db = db.getSiblingDB('yourapp');
// db.createUser({
//   user: 'appuser',
//   pwd: 'apppass',
//   roles: ['readWrite']
// });