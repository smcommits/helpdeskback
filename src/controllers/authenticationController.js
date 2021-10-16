const { User } = require('../models')

exports.authenticate = async(req, res) => {
    const {name, facebookID} = req.body 
    let user = await User.findOne({
      where: { facebookID }
    })

    if(!user) {
      try {
        let user = await User.create({name, facebookID})
        return res.json(user)
      } catch(err) {
        return res.status(500).json(err)
      }
    }
   return res.status(200)
  }

