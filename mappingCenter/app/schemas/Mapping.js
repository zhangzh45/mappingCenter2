/**
 * Created by yuzaizai on 2016/5/24.
 */
// ��֯ϵͳ��Ӧ��ϵͳӳ���
var mongoose = require('mongoose');

var MappSchema = new mongoose.Schema({
   mapName: String,
   userId : String,
   organName: String,
   appName: String,
   timesUpdate: Number,
   mapState: Number,
   meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }

});
MappSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
};
module.exports = MappSchema;
