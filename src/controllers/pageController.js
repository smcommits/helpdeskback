const Page = require('../models/page');
const User = require('../models/user');

exports.new = async function (req, res) {
  const { pageID, facebookID } = req.body;
  console.log(pageID, facebookID);
  const page = await Page.exists({ pageID });
  console.log(page)

  if (!page) {
    const user = await User.findOne({facebookID})
    if (user) {
      const page = await Page.create({ pageID, user: user.id })
      return res.json(page)
    }
  }
  return res.json({success: 'true'});
}
