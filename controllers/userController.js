const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const auth = require("../middlewares/auth")
const User = require("../models/user.js")

// Register a new user 
router.post("/register", async (req , res)=>{
      try {
            // destructure the body request 
            let { username, email, password } = req.body
            // validate the data that is coming in 
            if(!username || !password || !email) {
                  return res.status(400).json({msg: "Not all fields have been entered."})
            }
            // check if there is an user with that username or email already in the db  
            const existingUsername = await User.findOne({ username: username });
            if(existingUsername){
                  return res.status(400)
                  .json({ msg: "An account with this username or email already exists." });
            }
            // start the manipulation of the data to register the new user 
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);
            const newUser = new User ({
                  //  username will be the username value, same for email and we are adding
                  //  the password hashed to the db to prevent hacking and incrise security
                  username, email, password: passwordHash
            })
            const savedUser = await newUser.save()
            // the user document that we'll return to the front end with the token 
            res.send(savedUser)
      } catch (error) {
            res.status(500).json({ error: error.message })
      }
})

router.post("/login", async (req, res)=>{
      try {
            // destructure the body request 
            const { email, password } = req.body
            if(!email || !password) {
                  return res.status(400).json({msg: "Not all fields have been entered."})
            }
            // look for user in db by email
            const user = await User.findOne({ email: email })
            // if theres no user 
            if(!user){ 
                  return res.status(400).json({ msg: "No account with this email has been registered, try to register." });}
            // compare the password the user entered and the one we have on the db 
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: 'Invalid credentials.'})
            const token = jwt.sign({id: user.id}, "" + process.env.JWT_SECRET)
            res.json({token, user: { username: user.username, email: user.email}})

      } catch (error) {
            res.status(500).json({ error: err.message })
      }
})
router.post("/tokenIsValid", async (req, res) => {
      try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);
      const verified = jwt.verify(token, "" + process.env.JWT_SECRET);
      if (!verified) return res.json(false);
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);
      return res.json(true);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

router.get("/", auth, async (req, res) => {
      User.find({}, (error, foundworkout) => {
            error?
            console.log(error)
            :
            res.json(foundworkout);
      });
})

module.exports = router