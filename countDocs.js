function getDocCountFor(db) {
    var collectionNames = db.getCollectionNames();
    collectionNames.forEach(function (n) { print(db + "." + n + ": " + db.getCollection(n).count() + " documents")});
}

// var mgo = new Mongo()
// better way to make sure to account for different hosts/ports etc.:
var mgo = db.getMongo();
mgo.getDBNames().forEach(function(name){ var db = mgo.getDB(name); if (db!="admin" && db!="config" && db!="local") { getDocCountFor(db) } })

