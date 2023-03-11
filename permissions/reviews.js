const AccessControl = require('role-acl');
const ac = new AccessControl();


ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('create')
    .on('reviews');
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('update')
    .on('review', ['rating', 'allText']);
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete')
    .on('review');

ac.grant('admin').execute('update').on('review');
ac.grant('admin').execute('delete').on('review');


exports.create = (requester, data) =>
ac.can(requester.role).context({requester:requester.ID, owner:data.userID}).execute('create').sync().on('reviews');

// maybe it's not gonna be requester.ID and data.ID, maybe data.userID ??

exports.update = (requester, data) =>
ac.can(requester.role).context({requester:requester.ID, owner:data.userID}).execute('update').sync().on('review');

exports.delete = (requester, data) =>
ac.can(requester.role).context({requester:requester.ID, owner:data.userID}).execute('delete').sync().on('review');