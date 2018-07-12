"use strict";
const request = require('request-promise');
const messages = require('elasticio-node').messages;

exports.process = processAction;

/**
 * Executes the action's logic by sending a request to the Petstore API and emitting response to the platform.
 * The function returns a Promise sending a request and resolving the response as platform message.
 *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as apiKey and pet status
 * @returns promise resolving a message to be emitted to the platform
 */
function processAction(msg, cfg) {
  for(var att_name in ['email', 'password']) {
    if (!att_name in msg) {
      throw new Error(`${att_name} is required`);
    }
  }

  var user_type = 'existing'
  if ('last_name' in msg) {
    user_type = 'new'
  }

  const result = {
    user: {
      user_type: user_type,
      email: msg.body.email,
      password: msg.body.password,
      salutation: msg.body.salutation,
      first_name: msg.body.first_name,
      last_name: msg.body.last_name,
      telephone: msg.body.telephone,
      mobile_phone: msg.body.mobile_phone,
      terms_and_conditions_accepted: msg.body.terms_and_conditions_accepted
    }
  }

  return messages.newMessageWithBody(result);
}
