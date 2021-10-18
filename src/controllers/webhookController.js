const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');
const Page = require('../models/page')

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
    } else {
      return res.status(403)
    }
}

exports.deliver = function(req, res){
  let body = req.body
  req.io.in('messagengerRoom').emit('message', {body});
  console.log(body)
  if(body.object === 'page'){
    body.entry.forEach(function(entry) {
      let pageID = entry.id
      let webhookEvent = entry.messaging[0]
      let senderPSID = webhookEvent.sender;
      if(webhookEvent.message) {
        handleMessage(webhookEvent.message, req.io, senderPSID.id, pageID)
      }
  });

  return res.status(200).send('EVENT_RECIEVED');
 } else {
   return res.sendStatus(404)
  }

}


// Handles messages events
async function handleMessage(receivedMessage, io, senderPSID, pageID) {
  if(receivedMessage.text) {
    const user = await getUser(pageID)
    const conversation = await createConversation(senderPSID, pageID, user.id)
    console.log(conversation.id)
    const message = await createMessage(receivedMessage.text, conversation.id)
    console.log(`message${user.facebookID}`)  
    io.in(`message${user.facebookID}`).emit('message', {message, senderPSID})
  }
}


async function createConversation(senderPSID, pageID, recieverID) {
  const conversation = await getConversation(pageID)
  if(!conversation) {
  const conversation =  await Conversation.create({senderID: senderPSID, pageID:pageID, reciever: recieverID})
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
  let conversation = await Conversation.findOne({pageID: pageID})
  return conversation
}

async function createMessage(text, conversationID) {
 const message = await Message.create({text, conversation: conversationID})
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
