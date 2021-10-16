const User  = require('../models/user')

exports.authenticate = async function(req, res) {
    const {name, facebookID} = req.body 
    let user = await User.exists({ facebookID })

    if(!user) {
        let user = new User({name, facebookID});
      user.save(function(err) {
        if(err) return res.json(err)
        return res.json(user)
      })
    }
   return res.status(200)
}

