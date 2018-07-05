"use strict";
const co = require('co');
const request = require('request-promise');
const messages = require('elasticio-node').messages;
const parser = require('../util/response-parser.js');

exports.process = processAction;

/**
 * Executes the action's logic by sending a request to the Compeon API and emitting response to the platform.
 * The function returns a Promise sending a request and resolving the response as platform message.
 *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as apiKey and pet status
 * @returns promise resolving a message to be emitted to the platform
 */
function processAction(msg, cfg) {

    const baseUrl = cfg.url;
    const user_email = cfg.user_email;
    const user_password = cfg.user_password;

    const body = msg.body;

    if (!baseUrl) { throw new Error('Url is required'); }
    if (!user_email) { throw new Error('Email is required'); }
    if( user_email == 'no_auth' ) {
      console.log("skipping session request fro user '%s'", user_email);
      return messages.newMessageWithBody({ message: 'authorization skipped', user: user_email });
    } else {
      if (!user_password) { throw new Error('Password is required'); }

      const requestOptions = {
          uri: `${baseUrl}/v1/session?include=user`,
          headers: {
              'Content-Type': 'application/vnd.api+json'
          },
          body: {
            data: {
              attributes: {
                email: user_email,
                password: user_password
              }
            }
          },
          json: true
      };

      // return the promise that sends a request to the Compeon API
      return co(function* gen() {
          const response = yield request.post(requestOptions);
          console.log("got response from %s/v1/session: %j", baseUrl, response);
          const data = response.data;
          const attributes = data.attributes;
          const token = attributes.token;
          const included = response.included;
          const user = included[0];
          const user_attributes = user.attributes;

/**
          return messages.newMessageWithBody({
            token: token,
            user_id: user.id,
            user_email: user_attributes.email,
            user_first_name: user_attributes['first-name'],
            user_kind: user_attributes.kind,
            user_last_name: user_attributes['last-name'],
            user_mobile_phone: user_attributes['mobile-phone'],
            user_role: user_attributes.role,
            user_salutation: user_attributes.salutation
          });
**/
          return parser(response);


      });

    }



}
