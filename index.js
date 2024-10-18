//Adding express
const express = require('express')
//Instantiate express object 
const app = express()
const path = require('path')
const { title } = require('process')
const { message } = require('statuses')
const db1 = require("./db/db.js") 
const cors = require("cors")
app.use(cors())
const now = new Date()
const current = now.toDateString();
const user = require('./Auth/user.js')
app.use(user)

const bodyparser = require("body-parser")
//const bodyParser = require('body-parser')
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

const {client} = require("./db/db.js")
const db = client.db('EventAppDB1') //declare db = a database named Blogs
const checkauth = require('./Auth/checkauth.js')

// // Read From database (Blogs) and collection(blogs)
// app.get('/', async (req,res) => {
//     //const db = client.db('Blogs')
//     //res.send('<h1>Getting started with APDS!</h1>')
//     let collection = await db.collection("blogs") // declare collection = a collection named blogs
//     let results = await collection.find({}).toArray()
//     res.send(results).status(200);
// })


// /*Making a / route 
// app.get('/', (req,res) => {
//     res.send('<h1>Getting started with APDS!</h1>')
// })*/

// app.get('/sample', (_,res) => { //underscore means a req isnt going to be used
//     res.sendFile(path.join(__dirname, 'sample2.html'))
    
// })



// //app.listen(PORT, (req,res) => {
// //    console.log(`Server started on Port: ${PORT} @ ${current}`) 
// //})

// //Add into database named Blogs and collection named blogs
// app.get('/blog',(_,res) => {
//     const blogs = [
//         {
//             title: "Post 1",
//             post: "Chowing their 10 minutes break"
//         },
//         {
//             title:"Post 2",
//             post:"And im loving it!!!"
//         }
//     ]
//     res.json({
//         message: "<------ POSTS ------>",
//         blogs:blogs
//     })
// })


// app.post('/addblog',async (req,res) => {
//     try {
//         const blogModel = {
//             title: req.body.title,
//             post: req.body.post,
//             when: current 
//         }
//         const collection = db.collection('blogs')
//         const result = await collection.insertOne(blogModel)
//         res.status(201).send(result)
//     }
//     catch(e){
//        console.error('Failed to push a BLog',e)
//        res.status(500).send('Internal server error')     
//     }
// })

// // Deleted from the database
// const {ObjectId} = require('mongodb')
// app.delete('/removeblog/:id', async (req, res) => {
// const query = {_id: new ObjectId(req.params.id)}
//     const collection = db.collection('blogs')
//     let result = await collection.deleteOne(query)
//     res.send(result).status(204)
// })

// //Update the collection from the database
// app.put('/update/:id', async (req, res) => { // can use PUT or PATCH
//     const query = {_id: new ObjectId(req.params.id)}
//     const update = {
//         $set:{
//             title: req.body.title,
//             post: req.body.post,
//             when: current
//         }
//     }
//     let collection = await db.collection('blogs')
//     let result = await collection.updateOne(query, update)
//     res.send(result).status(201)
// })



module.exports = app