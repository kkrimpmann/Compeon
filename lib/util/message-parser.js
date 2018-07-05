"use strict";

const messages = require('elasticio-node').messages;

module.exports = ParseMessage;

function ParseMessage(msg, prefix) {
  console.log("parsing message for attributes beginning with '%s'", prefix);
  console.log("received message: %j", msg);
  for(var idx in msg.body) {
    if(idx.startsWith(prefix)) {
      console.log("found attribute attribute '%s'", idx);
      const new_key = idx.substr(prefix.length, idx.length);
      console.log("found attribute '%s', new key is '%s'", idx, new_key);

    }
  }
}
