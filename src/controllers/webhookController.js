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
      let sender_psid = webhook_event.sender;
      console.log("Sender PSID:" + sender_psid)
      if(webhook_event.message) {
        console.log(message)
        handleMessage(webhook_event.message, req.io)
      }
    });

  return res.status(200).send('EVENT_RECIEVED');
  } else {
    return res.sendStatus(404)
  }

}


// Handles messages events
function handleMessage(received_message, io) {
  if(received_message.text) {
    console.log('here')
    message = received_message.text
    
    io.in('messagengerRoom').emit('message', {received_message})
  }
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  
}

const broadcastMessage = function(io) {

}
