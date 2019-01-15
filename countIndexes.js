function getDocCountFor(db) {
    var collectionNames = db.getCollectionNames();
    collectionNames.forEach(function (n) { db.getCollection(n).getIndexes().forEach(function (i) { if (i.name != "_id_") print(db + "." + n + ": " + i.name)})});
}

// var mgo = new Mongo()
// better way to make sure to account for different hosts/ports etc.:
var mgo = db.getMongo();
mgo.getDBNames().forEach(function(name){ var db = mgo.getDB(name); if (db!="admin" && db!="config" && db!="local") { getDocCountFor(db) } })

