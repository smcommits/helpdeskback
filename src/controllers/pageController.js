const Page = require('../models/page');
const User = require('../models/user');

exports.new = async function(req, res) {
    const {pageID, facebookID } = req.body
    console.log(pageID, facebookID)
    let page = await Page.exists({pageID})
    if(!page) {
        User.findOne({facebookID: facebookID}, function(err, user) {
        if(err) return res.json(err)
        if(user) {
            Page.create({pageID, user: user.id}, function(err, page) {
                if(err) return res.json(err)
                return res.json(page)
            })
        }
    })
    }
    return res.status(200)
}