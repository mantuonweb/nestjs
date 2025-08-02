db = db.getSiblingDB('admin');
db.createUser({
  user: 'root',
  pwd: 'example',
  roles: ['root']
});