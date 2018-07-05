"use strict";
const request = require('request-promise');

module.exports = verify;

/**
 * Executes the verification logic by sending a simple to the Petstore API using the provided apiKey.
 * If the request succeeds, we can assume that the apiKey is valid. Otherwise it is not valid.
 *
 * @param credentials object to retrieve apiKey from
 *
 * @returns Promise sending HTTP request and resolving its response
 */
function verify(credentials) {

    // access the value of the apiKey field defined in credentials section of component.json
    const baseUrl = credentials.url;
    const user_email = credentials.user_email;
    const user_password = credentials.user_password;

    console.log("verifying credentials at %s for user %s", baseUrl, user_email);

    if( user_email == 'no_auth' ) { 
      console.log("skipping session request for user_email '%s'", user_email);
      return true;
    }
    // sending a request to the most simple endpoint of the target API
    const requestOptions = {
        uri: `${baseUrl}/v1/session`,
        headers: {
            'Content-Type': 'application/vnd.api+json'
        },
        json: true,
        body: {
          data: {
            attributes: {
              email: user_email,
              password: user_password
            }
          }
        }
    };

    // if the request succeeds, we can assume the api key is valid
    return request.post(requestOptions);
}
