/**
 * Created by yuzaizai on 2016/11/22.
 */
// ģʽ�����ģ��
var mongoose = require('mongoose');
var OrganDepSchema = require('../schemas/OrganDep');
var OrganDep = mongoose.model('OrganDep',OrganDepSchema);

module.exports = OrganDep;







