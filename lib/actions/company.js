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

  var company_type = 'existing'
  if ('name' in msg.body) {
    company_type = 'new'
  }

  const result = {
    company: {
      company_type: company_type,
      id: msg.body.id,
      street: msg.body.street,
      city: msg.body.city,
      crefo_id: msg.body.crefo_id,
      legal_form: msg.body.legal_form,
      name: msg.body.name,
      zip_code: msg.body.zip_code,
      turnover_class: msg.body.turnover_class,
      founding_year: msg.body.founding_year
    }
  }

  return messages.newMessageWithBody(result);
}
