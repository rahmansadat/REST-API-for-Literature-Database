const AccessControl = require('role-acl');
const ac = new AccessControl();

// This line is not required, however without it the application crashes because
// role-acl cannot find the role 'user'. 
ac.grant('user').execute('read').on('bookGenre'); 

ac.grant('admin').execute('create').on('bookGenre');
ac.grant('admin').execute('delete').on('bookGenre');

exports.create = (requester) =>
ac.can(requester.role).execute('create').sync().on('bookGenre');

exports.delete = (requester) =>
ac.can(requester.role).execute('delete').sync().on('bookGenre');