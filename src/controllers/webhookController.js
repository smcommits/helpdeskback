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
        handleMessage(webhookEvent.message, req.io, senderPSID, pageID)
      }
  });

  return res.status(200).send('EVENT_RECIEVED');
 } else {
   return res.sendStatus(404)
  }

}


// Handles messages events
function handleMessage(receivedMessage, io, senderPSID, pageID) {
  if(receivedMessage.text) {
    const user = getUser(pageID)
    const conversation = createConversation(senderPSID, pageID, user.id)
    const message = createMessage(receivedMessage.text, conversation.id)
    console.log(user.name)  
    io.in(`message${user.facebookID}`).emit('message', {message, senderPSID})
  }
}


async function createConversation(senderPSID, pageID, recieverID) {
  const conversation = getConversation(pageID)
  if(!conversation) {
    Conversation.create({senderID: senderPSID, pageID:pageID, reciever: recieverID}, function(err, conversation) {
      if(err) return err;
      return conversation
    })
  }

  return conversation
}


function getUser(pageID) {
  Page.findOne({pageID: pageID}).
    populate('user').
    exec(function(err, user) {
      if(err) return err
      return user
    })
}

async function getConversation(pageID) {
  const conversation = await Conversation.exists({pageID})
  if(!conversation) return null;
  return conversation
}

function createMessage(text, conversationID) {
  Message.create({text, conversation: conversationID},  function(err, message) {
    if(err) return err
    return message
  })
}


// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  
}

const broadcastMessage = function(io) {

}
