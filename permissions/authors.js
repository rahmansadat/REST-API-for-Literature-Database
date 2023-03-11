const AccessControl = require('role-acl');
const ac = new AccessControl();

// This line is not required, however without it the application crashes because
// role-acl cannot find the role 'user'. 
ac.grant('user').execute('read').on('author'); 

ac.grant('admin').execute('create').on('authors');
ac.grant('admin').execute('update').on('author');
ac.grant('admin').execute('delete').on('author');

exports.create = (requester) =>
ac.can(requester.role).execute('create').sync().on('authors');

exports.update = (requester) =>
ac.can(requester.role).execute('update').sync().on('author');

exports.delete = (requester) =>
ac.can(requester.role).execute('delete').sync().on('author');