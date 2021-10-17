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
  if(body.object === 'page'){
    body.entry.forEach(function(entry) {
      let webhook_event = entry.messaging[0]
      return console.log(webhook_event)

      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID:" + sender_psid)

      if(webhook_event.message) {
        handleMessage(sender_psid, webhook.event.message, req.socket)
      }
    });

  return res.status(200).send('EVENT_RECIEVED');
  } else {
    return res.sendStatus(404)
  }

}


// Handles messages events
function handleMessage(sender_psid, received_message, socket) {
  if(received_message.text) {
      socket.emit("FromAPI", {message, sender_psid})
  }
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  
}
