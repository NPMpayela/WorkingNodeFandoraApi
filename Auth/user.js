const express = require('express')
const app = express()
const {connect ,client} = require('../db/db.js')
const db = client.db('EventAppDB1')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { message } = require('statuses')
const ExpressBrute = require('express-brute')
const store = new ExpressBrute.MemoryStore()
const brute = new ExpressBrute(store)
const { ObjectId } = require('mongodb');

app.use(express.json());

app.post('/signup1', async (req,res) => {
   try{

    // Check if required fields are present
    const { name, surname, email, password } = req.body;
    if (!name || !surname || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedpassword = await bcrypt.hash(req.body.password, 10)

    let userModel = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashedpassword
    }
    let collection = await db.collection('users')
    await collection.insertOne(userModel)
    res.status(201).send(`Welcome ${userModel.name} ${userModel.surname}`)
    console.log(hashedpassword)
    }
    catch(err){
        console.error(err)
    }

})

app.post('/login1', async (req,res) => {
    const {email,password} = req.body
    try{
        let collection = await db.collection('users')
        let user = await collection.findOne({email:email})
        if(!user){
            return res.status(401).send({message: "Check your email or password"})
        }
        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(401).send({message: "Check your email or password"})
        }
        else{
            const token = jwt.sign({email: user.email}, 'ThisIsThetringUsedForOutToken', {expiresIn: '1h'})
            res.status(200).json({message: "Welcome!!!"})
            console.log('The Generated token:', token)
        }
    }
    catch(err){
        console.error(err)
        res.status(401).json({message: 'Failed Login Attempt'})
    }
})

// MyReg
app.post('/register', async (req,res) => {
    try{
 
     // Check if required fields are present
     const { username, password } = req.body;
     if (!username || !password) {
         return res.status(400).json({ message: 'All fields are required' });
     }
 
 
     let userModel = {
         username: req.body.username,
         password: req.body.password
     }

     let collection = await db.collection('MyUsers')
     await collection.insertOne(userModel)
     
     res.status(201).json({ message: `Welcome ${userModel.username}`, success: true });
     }
     catch(err){
         console.error(err)
         res.status(500).json({ message: 'Internal server error', success: false });
     }
 
 })

 //MyLogin
 app.post('/login', async (req,res) => {
    const {username,password} = req.body
    try{
        let collection = await db.collection('MyUsers')
        let user = await collection.findOne({username:username})
        if(!user){
            return res.status(401).send({message: "Check your username or password"})
        }

        if(user.password !== password){
            return res.status(401).send({message: "Check your username or password"})
        }
        else{
            res.json({ success: true, message: 'Login successful' });
        }
    }
    catch(err){
        console.error(err)
        res.status(401).json({message: 'Failed Login Attempt'})
    }
})


//Create Event
app.post('/CreateEvent', async (req,res) => {
    try{
 
     // Check if required fields are present
     const { eventName, organisers, location, category, date, details  } = req.body;
     
     
 
     let EventModel = {
        eventName : req.body.eventName,
        organisers : req.body.organisers,
        category :  req.body.location,
        location :  req.body.category,
        date :      req.body.date,
        details :   req.body.details 
     }


     let collection = await db.collection('Events')
     await collection.insertOne(EventModel)
      
        res.status(201).json({ message: `Successfully created.`, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
 });
 

// Delete all events with null eventName
app.delete('/Events/nullNames', async (req, res) => {
    try {
        let collection = await db.collection('Events');
        const result = await collection.deleteMany({ eventName: null }); // Match by null eventName

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No events found with null event names.', success: false });
        }

        res.status(200).json({ message: `${result.deletedCount} events with null event names successfully deleted.`, success: true });
    } catch (err) {
        console.error('Error deleting events with null event names:', err); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

// Delete Event
app.delete('/Events', async (req, res) => {
    try {
        // Check if required fields are present
        const { _id } = req.body;

        // Check if _id is provided
        if (!_id) {
            return res.status(400).json({ message: 'Event ID is required.', success: false });
        }

        let collection = await db.collection('Events');
        const result = await collection.deleteOne({ _id: new ObjectId(_id) }); // Make sure to convert to ObjectId

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Event not found.', success: false });
        }

        res.status(200).json({ message: 'Event successfully deleted.', success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

// Get all events
app.get('/Events', async (req, res) => {
    try {
        let collection = await db.collection('Events');
        
        // Retrieve all documents (events) from the 'Events' collection
        let eventsList = await collection.find({}).toArray();
        
        // If there are events, return them; otherwise, return an empty array
        res.status(200).json({ events: eventsList, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});


//SSO Login
app.post('/auth/sso', async (req, res) => {
    try {
        // Check if required fields are present
        const { providerId, email, displayName } = req.body;
        if (!providerId || !email || !displayName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Prepare user model
        let userModel = {
            providerId: providerId,
            email: email,
            name: displayName,
        };
        // Access the user collection
        let collection = await db.collection('MyUsers');
        let existingUser = await collection.findOne({ email: userModel.email });

        if (!existingUser) {
            // If user doesn't exist, create a new one
            await collection.insertOne(userModel);
            return res.status(201).json({ 
                message: `Welcome ${userModel.name}`, 
                success: true 
            });
        }

        // User exists
        return res.status(200).json({ 
            message: 'User logged in', 
            user: existingUser, 
            success: true 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});



module.exports = app
/*

*/