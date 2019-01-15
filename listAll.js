
function getReadableFileSizeString(fileSizeInBytes, decimalPlacer=1) {
    // for more concise solutions see: https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
    var i = 0;
    var scale = 1024;
    var byteUnits = [' B', ' KiB', ' MiB', ' GiB', ' TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	while (fileSizeInBytes >= scale) {
        fileSizeInBytes = fileSizeInBytes / scale;
        i++;
    } 

    return Number(Math.max(fileSizeInBytes, 0.1).toFixed(decimalPlacer)) + byteUnits[i];
};

function getStatsFor(db, dir='desc', options={}) {
  	if (['asc', 'desc'].indexOf(dir) === -1) {
  	  	print('please use \'asc\' or \'desc\' for direction')
  	  	return
  	}
  	
    var collectionNames = db.getCollectionNames();
    var stats = [];
    collectionNames.forEach(function (n) { stats.push(db.getCollection(n).stats()); });
    stats = stats.sort(function(a, b) { return (dir === 'desc') ? b['size'] - a['size'] : a['size'] - b['size']; });
    for (var c in stats) {
        var size = getReadableFileSizeString(stats[c]['size']);
        var storageSize = getReadableFileSizeString(stats[c]['storageSize']);
        var totalIndexSize = getReadableFileSizeString(stats[c]['totalIndexSize']);

		if (!options.long) {
	        print(stats[c]['ns'] + ": " + size + " (" + storageSize + " index: " + totalIndexSize + ")");
		}
		else {
			print(stats[c]['ns'] + "-" + 
				"documentCount" + ":" + stats[c]['count'] + "-" + 
	        	"indexesCount" + ":" + stats[c]['nindexes'] + "-" + 
    	    	"totalIndexSize" + ":" + totalIndexSize + "-" + 
        		"size" + ":" + size + "-" +
        		"storageSize" +":"+ storageSize);
		}
    }
}


function getAllStats(dir='desc') {
    var names = mgo.getDBNames();
    for (var i in names) {
        var db = mgo.getDB(names[i]);
        print('\n    ' + db + '\n'); 
        getStatsFor(db, dir);
    }
}


// var mgo = new Mongo()
// better way to make sure to account for different hosts/ports etc.:
var mgo = db.getMongo();
mgo.getDBNames().forEach(function(name){ var db = mgo.getDB(name); if (db!="admin" && db!="config" && db!="local") { getStatsFor(db) } })

