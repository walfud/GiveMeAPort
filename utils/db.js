const MongoClient = require('mongodb').MongoClient;
const async = require('async');

function find(collection, opt, cb) {
    async.waterfall([
        (callback) => {
            MongoClient.connect('mongodb://localhost:27017/givemeaport', (err, db) => {
                callback(err, db);
            });
        },

        (db, callback) => {
            const coll = db.collection(collection);
            coll.find(opt).toArray((err, docs) => {
                callback(err, db, docs);
            });
        },
    ], (err, db, docs) => {
        if (db) {
            db.close();
        }

        if (err) {
            console.error(err);
            cb(err, undefined);
            return;
        }

        cb(undefined, docs);
    });
}

module.exports.find = find;
