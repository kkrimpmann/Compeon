"use strict";

const messages = require('elasticio-node').messages;

module.exports = ParseMessage;

function ParseMessage(msg, prefix) {
  console.log("parsing message for attributes beginning with '%s'", prefix);
  console.log("received message: %j", msg);
  for(var idx in msg) {
    console.log("message has attribute '%s'", idx);
  }
}
