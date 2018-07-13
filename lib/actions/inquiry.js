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
  for(var att_name in []) {
    if (!att_name in msg) {
      throw new Error(`${att_name} is required`);
    }
  }

  const result = {
    inquiry: {
      excluded_bank_codes: msg.body.excluded_bank_codes,
      additional_information_for_compeon: msg.body.additional_information_for_compeon,
      amount: msg.body.amount,
      consider_subsidies: msg.body.consider_subsidies,
      favored_decision_date: msg.body.favored_decision_date,
      purpose_kind: msg.body.purpose_kind,
      product_kind: msg.body.product_kind
    }
  }

  return messages.newMessageWithBody(result);
}
