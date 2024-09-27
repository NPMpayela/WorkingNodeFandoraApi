const jwt = require('jsonwebtoken')
const { message } = require('statuses')
const checkauth = (req, res,next) => {
    try{
        const token= req.header.authorization.split(' ')[1]
    jwt.verify(token, 'ThisIsThetringUsedForOutToken')
    next()
    }
    catch(err){
        res.status(401).json({message: "You need to get authenticated for the below process"})
        console.error(err)
    }
}

module.exports = checkauth