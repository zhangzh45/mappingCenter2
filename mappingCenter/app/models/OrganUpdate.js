/**
 * Created by yuzaizai on 2016/4/17.
 */
var mongoose = require('mongoose');
var OrganUpdateSchema = require('../schemas/OrganUpdate');
var OrganUpdate = mongoose.model('Movie',OrganUpdateSchema);

module.exports = OrganUpdate;