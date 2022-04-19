// initiating all the depedencies needed 
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const db = mongoose.connection
const cors = require('cors')
require ('dotenv').config()

const PORT = process.env.PORT || 3003

// Database Connection //
const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,  
  useUnifiedTopology: true,
  useFindAndModify: false,
})

//  DB error handeling 
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'))
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI))
db.on('disconnected', () => console.log('mongo disconnected'))

// Middleware //
app.use(cors())
app.use(express.json())


// Controllers //
const user_controller = require('./controllers/userController')
app.use('/', user_controller)

// Listener to make sure the server is runing alright 
// Run npm start to see the message
app.listen(PORT, ()=>{
      console.log('listening to port ' +  PORT)
})