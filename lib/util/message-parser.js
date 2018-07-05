"use strict";

// const messages = require('elasticio-node').messages;

module.exports = ParseMessage;

function ParseMessage(msg, prefix) {
  console.log("parsing message for attributes beginning with '%s'", prefix);
  console.log("received message: %j", msg);
  var result = {};
  for(var idx in msg.body) {
    if(idx.startsWith(prefix)) {
      const new_key = idx.substr(prefix.length, idx.length).replace(/_/g, '-');
      console.log("found attribute '%s', new key is '%s'", idx, new_key);
      result[new_key] = msg.body[idx];
    }
  }
  return result;
}
