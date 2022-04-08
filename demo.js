const {MongoClient} = require("mongodb");

async function main() {
    const uri = "mongodb://troels:dockernodejstest123@20.229.2.139:2700/nodejs_app_db?w=majority";

    const client = new MongoClient(uri);
    try {
        await client.connect();

        //await listDatabases(client);

        /*await createDocument(client, {
            name: "Random",
            summary: "Test Random",
            rooms: 3,
            roomsPerFloor: [3, 4, 1]
        });*/

        /*await createdMultipleDocuments(client, [
            {
                name: "Random 1",
                summary: "Test Random",
                rooms: 8,
                roomsPerFloor: [3, 4, 1, 12, 456],
                articlesInEstate: true
            },
            {
                name: "Random 2",
                summary: "Test Random",
                rooms: 5,
                roomsPerFloor: [3, 41],
                articlesInEstate: [
                    {
                        name: "spoon",
                        no: 12
                    },
                    {
                        name: "fork",
                        no: 12
                    }
                ]
            },
            {
                name: "Random 3",
                summary: "Test Random",
                rooms: 6,
                roomsPerFloor: [34, 1],
                articlesInEstate: 4.3
            },
            {
                name: "Random 3",
                summary: "Test Random",
                rooms: 6,
                roomsPerFloor: [34, 1],
                articlesInEstate: { 
                    something: [1,2,3,4,5],
                    somthingElse: { random: 12 }
                }
            }
        ]);*/

        //await findOneDocumentByName(client, "Random 3");
        
        await findDocumentsWithMinimumRoomsAndMinimumRoomsPerFloor(client, {
            minimumRooms: 7,
            minimumRoomsPerFloor: 2,
            maximumNoOfResults: 5
        });

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("databases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    });
}

async function findDocumentsWithMinimumRoomsAndMinimumRoomsPerFloor(client, {
    minimumRooms = 0,
    minimumRoomsPerFloor = 0,
    maximumNoOfResults = Number.MAX_SAFE_INTEGER
}) {
    const cursor = await client.db("nodejs_app_db").collection("test").find({
        rooms: { $gte: minimumRooms },
        roomsPerFloor: { $gte: minimumRoomsPerFloor }
    }).sort({ rooms: -1 })
    .limit(maximumNoOfResults);

    const results = await cursor.toArray();
    if (results.length > 0) {
        console.log(`Found documents with the least ${minimumRooms} rooms and least ${minimumRoomsPerFloor} rooms per floor`);
        results.forEach((result, i) => {
            console.log();
            console.log(`${i + 1}`);
            console.log(`${result._id}`);
            console.log(`${result.rooms}`);
        });
    }
}

async function findOneDocumentByName(client, nameOfDocument) {
    const result = await client.db("nodejs_app_db").collection("test").findOne({name: nameOfDocument});
    if (result) {
        console.log(`Found a document in the collection with name '${nameOfDocument}'`);
        console.log(result);
    } else {
        console.log(`Found nothing in the collection with name '${nameOfDocument}'`);
    }
}

async function createdMultipleDocuments(client, newDocuments) {
    const result = await client.db("nodejs_app_db").collection("test").insertMany(newDocuments);

    console.log(`${result.insertedCount} new Documents created with the following id(s):`);
    console.log(result.insertedIds);
}

async function createDocument(client, newDocument) {
    const result = await client.db("nodejs_app_db").collection("test").insertOne(newDocument);

    console.log(`New document created with the following id: ${result.insertedId}`);
}