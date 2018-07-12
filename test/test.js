"use strict";

const messages = require('elasticio-node').messages;
const user = require('../lib/actions/user.js');

const msg = messages.newMessageWithBody({email: 'test@test.com', password: 'top_secret' })
const result = user.process(msg, {});
console.log("result: %j", result.body)
