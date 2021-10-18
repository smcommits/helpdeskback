const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');
const Page = require('../models/page')
const request = require('request')

exports.verify = function(req, res) {
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    if(mode && token){
      if(mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('webhook verified')
        return res.status(200).send(challenge)
      }
    }
}

exports.recieve = function(req, res){
  let body = req.body
  if(body.object === 'page'){
    body.entry.forEach(function(entry) {
      let pageID = entry.id
      let webhookEvent = entry.messaging[0]
      let time = entry.time
      let senderPSID = webhookEvent.sender;
      if(webhookEvent.message) {
        handleMessage(webhookEvent.message, req.io, senderPSID.id, pageID, time)
      }
  });

  return res.status(200).send('EVENT_RECIEVED');
 } else {
   return res.sendStatus(404)
  }

}

exports.send = function(req, res) {
  let { senderPSID, text, pageAccessToken } = req.body
  console.log(senderPSID, text, pageAccessToken)

  let request_body = {
    "recipient": {
      "id": senderPSID
    },
    "message": {
      "text": text
    }
  }

  request({
    "uri": "https://graph.facebook.com/v12/me/messages", 
    "qs": { "access_token": pageAccessToken }, 
    "method": "POST", 
    "json": request_body
  }, function(err, res, body) {
    if(!err) {
      console.log('message sent!')
    } else{
      console.error("Unable to send message:" + err);
    }
  })
}

// Handles messages events
async function handleMessage(receivedMessage, io, senderPSID, pageID, time) {
  if(receivedMessage.text) {
    const user = await getUser(pageID)
    const conversation = await createConversation(pageID, user.id)
    const message = await createMessage(receivedMessage.text, senderPSID, user.facebookID, conversation.id, time)
    console.log(`message${user.facebookID}`)  
    io.in(`message${user.facebookID}`).emit('message', {message, senderPSID})
  }
}


async function createConversation(pageID, userID) {
  const conversation = await getConversation(pageID)
  if(!conversation) {
  const conversation =  await Conversation.create({pageID:pageID, userID: userID})
  return conversation
  }
  return conversation
}


async function getUser(pageID) {
  const page = await Page.findOne({pageID: pageID}).populate('user');
  const user = page.user;

  return user
}

async function getConversation(pageID) {
  let conversation = await Conversation.exists({pageID})
  if(!conversation) return null;
  conversation = await Conversation.findOne({pageID: pageID})
  return conversation
}

async function createMessage(text, senderID, recieverID, conversationID, time) {
  const message = await Message.create({text, senderID, recieverID,  conversation: conversationID, time: time})
  return message
}


// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  
}

const broadcastMessage = function(io) {

}
