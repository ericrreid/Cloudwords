# Cloudwords
Various scripts in support of Cloudwords effort

### Overview
The goal is to migrate from a N-shard Cluster in AWS to a MongoDB Atlas Replica Set (Cloudwords' primary requirement). This should work from a source cluster of MongoDB version v2.6 and later.

We use modified version of mongomirror to migrate multiple source shards in parallel. In this case, we also make use of Mark Helstetter's shardSync tool as a coordinating wrapper over this mongomirrors. These mongomirrors will run, in parallel, until cutover.

### Approach
A new, temporary AWS instance (recommend i3.xlarge in this case) is created, and the following installed:
* OpenJDK 1.8 or later (https://openjdk.java.net/install/)
* A modified copy of mongomirror which allows for many-to-one simultaneous migrations (a Linux version which runs on Ubuntu 18.04 and later has been placed in the repository at https://github.com/scientiapress/Cloudwords/blob/master/mongomirror.gz)
* The shardSync tool from https://github.com/mhelmstetter/mongo-util

### Setup
* Install OpenJDK
* Download and unpack mongomirror from this repo
* Clone mongo-util
* Ensure this system has updated Java certs (otherwise shardSync will fail)
* Ensure Atlas destination replica set has this server whitelisted
* Create a backupAdmin user on each Shard/Replica Set on the source cluster
* Recreate any application users from source cluster onto destination replica set

### Migration (see PS engagement notes for details)
* Stop source cluster balancing - this must be left off until cutover
* Identify migratable collections using listCollections script (https://github.com/scientiapress/Cloudwords/blob/master/listCollections.bash)
* Identify/cleanup orphans on all source replica sets
* Start shardSync:
* `java -cp <shardSyncDir>/src/main/resources/:./mongo-util.jar com.mongodb.shardsync.ShardConfigSyncApp 
    -s mongodb://srcMongos:port/admin 
    -d mongodb://user:password@dstNode1:port,dstNode2:port,dstNode3:port 
    -shardtoRs 
    -p <pathto>/mongomirror`

### To verify successful migration (initial pass: compares number of documents and index definitions)
* Run the compareCollections script (https://github.com/scientiapress/Cloudwords/blob/master/compareCollections.bash), specifying the source and destination URI, username, password, and SSL parameter
* Note: the above script will sometimes list system. indexes, which will need to be considered when comparing output columns
