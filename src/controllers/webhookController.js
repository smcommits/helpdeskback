const request = require('request');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');
const Page = require('../models/page');

exports.verify = function (req, res) {
  const { VERIFY_TOKEN } = process.env;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('webhook verified');
      return res.status(200).send(challenge);
    }
  }
};

exports.recieve = function (req, res) {
  const { body } = req;
  if (body.entry[0].changes) {
    handleComment(body, req.io);
  } else {
    if (body.object === 'page') {
      body.entry.forEach((entry) => {
        const pageID = entry.id;
        const webhookEvent = entry.messaging[0];
        const { time } = entry;
        const senderPSID = webhookEvent.sender;
        if (webhookEvent.message) {
          handleMessage(webhookEvent.message, req.io, senderPSID.id, pageID, time);
        }
      });

      return res.status(200).send('EVENT_RECIEVED');
    }
    return res.sendStatus(404);
  }
};

exports.send = function (req, res) {
  const { senderPSID, text, pageAccessToken } = req.body;
  console.log(senderPSID, text, pageAccessToken);

  const request_body = {
    recipient: {
      id: senderPSID,
    },
    message: {
      text,
    },
  };

  request({
    uri: 'https://graph.facebook.com/me/messages',
    qs: { access_token: pageAccessToken },
    method: 'POST',
    json: request_body,
  }, (err, res, body) => {
    if (!err) {
      console.log(body);
      return res;
    }
    console.error(`Unable to send message:${err}`);
    return err;
  });
  return res.status(200);
};

// Handles messages events
async function handleMessage(receivedMessage, io, senderPSID, pageID, time) {
  if (receivedMessage.text) {
    const user = await getUser(pageID);
    const conversation = await createConversation(pageID, user.id);
    const message = await createMessage(
      receivedMessage.text,
      senderPSID,
      user.facebookID,
      conversation.id,
      time,
    );
    console.log(`message${user.facebookID}`);
    io.in(`message${user.facebookID}`).emit('message', { message, senderPSID, type: 'message' });
  }
}

async function handleComment(body, io) {
  console.log(body);
  const pageID = body.entry[0].id;
  const { time } = body.entry[0];
  const commentObject = body.entry[0].changes[0].value;
  const senderID = commentObject.from.id;
  const text = commentObject.message;
  const conversationID = commentObject.comment_id;
  const permalink = commentObject.post.permalink_url;
  const commentID = commentObject.comment_id;
  const postID = commentObject.post.id;

  const user = await getUser(pageID);
  const recieverID = user.facebookID;

  const responseObject = {
    time,
    senderID,
    text,
    conversation: conversationID,
    commentID,
    recieverID,
  };
  io.in(`message${user.facebookID}`).emit('message', {
    message: responseObject, senderPSID: senderID, type: 'comment', postID, permalink,
  });
}

async function createConversation(pageID, userID) {
  const conversation = await getConversation(pageID);
  if (!conversation) {
    const conversation = await Conversation.create({ pageID, userID });
    return conversation;
  }
  return conversation;
}

async function getUser(pageID) {
  const page = await Page.findOne({ pageID }).populate('user');
  const { user } = page;

  return user;
}

async function getConversation(pageID) {
  let conversation = await Conversation.exists({ pageID });
  if (!conversation) return null;
  conversation = await Conversation.findOne({ pageID });
  return conversation;
}

async function createMessage(text, senderID, recieverID, conversationID, time) {
  const message = await Message.create({
    text, senderID, recieverID, conversation: conversationID, time,
  });
  return message;
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {

}

const broadcastMessage = function (io) {

};
