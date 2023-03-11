const AccessControl = require('role-acl');
const ac = new AccessControl();

// This line is not required, however without it the application crashes because
// role-acl cannot find the role 'user'. 
ac.grant('user').execute('read').on('genre'); 

ac.grant('admin').execute('create').on('genres');
ac.grant('admin').execute('update').on('genre');
ac.grant('admin').execute('delete').on('genre');

exports.create = (requester) =>
ac.can(requester.role).execute('create').sync().on('genres');

exports.update = (requester) =>
ac.can(requester.role).execute('update').sync().on('genre');

exports.delete = (requester) =>
ac.can(requester.role).execute('delete').sync().on('genre');