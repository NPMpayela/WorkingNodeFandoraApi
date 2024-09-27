const {MongoClient}  = require("mongodb")
const dotenv  = require("dotenv")
dotenv.config();

const connstring = process.env.ATLAS_URI
const client = new MongoClient(connstring)

let conn 

async function connect(){
try
{
    //conn = await client.connect()
    await client.connect()
    console.log('MongoDB connected Successfully!!!')
}
catch(e)
{
    console.error(e)
}
}

module.exports = { connect, client }

