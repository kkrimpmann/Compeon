"use strict";
const request = require('request-promise');
const messages = require('elasticio-node').messages;
const msg_parser = require('../util/message-parser.js');
const resp_parser = require('../util/response-parser.js');
const uuidv4 = require('uuid/v4');

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

  const baseUrl = cfg.url;
  const user_prefix = (cfg.user_prefix)? cfg.user_prefix : 'user_';
  const company_prefix = (cfg.company_prefix)? cfg.company_prefix : 'company_';
  const inquiry_prefix = (cfg.inquiry_prefix)? cfg.inquiry_prefix : 'inquiry_';
  const body = msg.body;

  if (!baseUrl) { throw new Error('Url is required'); }

  const user_attributes = msg_parser(msg, user_prefix);
  const company_attributes = msg_parser(msg, company_prefix);
  const inquiry_attributes = msg_parser(msg, inquiry_prefix);

  const user_lid = uuidv4();
  const company_lid = uuidv4();

  const requestOptions = {
      uri: `${baseUrl}/v1/inquiries`,
      headers: {
          'Content-Type': 'application/vnd.api+json'
      },
      body: {
        data: {
          type: 'inquiries',
          attributes: inquiry_attributes,
          relationships: {
            company: {
              data: {
                type: 'companies',
                lid: company_lid
              }
            },
            user: {
              data: {
                type: 'users',
                lid: user_lid
              }
            },
          }
        },
        included: [
          {
            type: 'companies',
            lid: company_lid,
            attributes: company_attributes
          },
          {
            type: 'users',
            lid: user_lid,
            attributes: user_attributes
          }
        ]
      },
      json: true
  };

  console.log("sending request: %j", requestOptions);
  // return the promise that sends a request to the Petstore API
  return request.post(requestOptions)
      .then((response) => resp_parser(response));
}
