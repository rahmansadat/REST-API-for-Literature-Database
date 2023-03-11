const AccessControl = require('role-acl');
const ac = new AccessControl();

// This line is not required, however without it the application crashes because
// role-acl cannot find the role 'user'. 
ac.grant('user').execute('read').on('book'); 

ac.grant('admin').execute('create').on('books');
ac.grant('admin').execute('update').on('book');
ac.grant('admin').execute('delete').on('book');

exports.create = (requester) =>
ac.can(requester.role).execute('create').sync().on('books');

exports.update = (requester) =>
ac.can(requester.role).execute('update').sync().on('book');

exports.delete = (requester) =>
ac.can(requester.role).execute('delete').sync().on('book');