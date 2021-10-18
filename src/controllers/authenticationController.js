const User  = require('../models/user')

exports.authenticate = async function(req, res) {
    console.log('here')
    const {name, facebookID} = req.body 
    let user = await User.exists({ facebookID })

    if(!user) {
        User.create({name: name, facebookID: facebookID}, function(err, user) {
            if(err) return res.json(err)
            return res.json(user)
        })
    }
   return res.status(200)
}

