const AccessControl = require('role-acl');
const ac = new AccessControl();


ac.grant('user').execute('create').on('reviews');
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update')
    .on('review', ['rating', 'allText']);
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete')
    .on('review');

ac.grant('admin').execute('update').on('review');
ac.grant('admin').execute('delete').on('review');


exports.create = (requester) =>
ac.can(requester.role).execute('create').sync().on('reviews');

exports.update = (requester, data) =>
ac.can(requester.role).context({requester:requester.ID, owner:data.userID}).execute('update').sync().on('review');

exports.delete = (requester, data) =>
ac.can(requester.role).context({requester:requester.ID, owner:data.userID}).execute('delete').sync().on('review');