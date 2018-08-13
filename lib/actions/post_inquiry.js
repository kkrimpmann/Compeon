"use strict"
const request = require('request-promise')
const messages = require('elasticio-node').messages
const msg_parser = require('../util/message-parser.js')
const resp_parser = require('../util/response-parser.js')
const uuidv4 = require('uuid/v4')

exports.process = processAction

/**
 * Executes the action's logic by sending a request to the Petstore API and emitting response to the platform.
 * The function returns a Promise sending a request and resolving the response as platform message.
 *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as apiKey and pet status
 * @returns promise resolving a message to be emitted to the platform
 */
function processAction(msg, cfg) {

  const baseUrl = cfg.url
  const body = msg.body
  const user = body.user
  const company = body.company
  const inquiry = body.inquiry

  if (!baseUrl) { throw new Error('Url is required'); }

  var user_type = 'existing'
  var user_email
  var user_password
  if(!user) {
    user_email = cfg.user_email
    user_password = cfg.user_password
  } else {
    user_type = user.user_type
    user_email = user.email
    user_password = user.password
  }

  var inquiry_body = {
    data: {
      attributes: {},
      relationships: {
        user: {
          data: { type: 'users', id: user.id }
        },
        company: {}
      }
    }
  }

  if( user_type == 'existing' && company.company_type == 'existing' ) {
    return authenticate(baseUrl, user_email, user_password)
      .then( (response) => request.post({
        uri: `${baseUrl}/v1/inquiries`,
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Authorization: `token ${response.data.attributes.token}`
        },
        body: {
          data: {
            attributes: flatten(inquiry),
            relationships: {
              user: {
                data: { type: 'users', id: response.data.relationships.user.data.id }
              },
              company: {
                data: { type: 'companies', id: company.id }
              }
            }
          }
        },
        json: true
      }) )
  } else if( user_type == 'existing' && company.company_type == 'new' ) {
    const company_lid = uuidv4()
    return authenticate(baseUrl, user_email, user_password)
      .then( (response) => request.post({
        uri: `${baseUrl}/v1/inquiries`,
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Authorization: `token ${response.data.attributes.token}`
        },
        body: {
          data: {
            attributes: flatten(inquiry),
            relationships: {
              user: {
                data: { type: 'users', id: response.data.relationships.user.data.id }
              },
              company: {
                data: { type: 'companies', lid: company_lid }
              }
            }
          },
          included: [
            { type: 'companies', lid: company_lid, attributes: flatten(company) }
          ]
        },
        json: true
      }) )
  }
}

function authenticate(url, email, password) {
  return request.post({
    uri: `${url}/v1/session`,
    headers: {
        'Content-Type': 'application/vnd.api+json'
    },
    body: {
      data: {
        attributes: {
          email: email,
          password: password
        }
      }
    },
    json: true
  })
}

function flatten(obj) {
  var new_obj = {}
  Object.entries(obj).forEach((value) => {
    if( (typeof(value[1]) == 'object') && ( value[0].endsWith('detail') ) ) {
      var items = flatten(value[1])
      Object.entries(items).forEach((item) => { new_obj[item[0].replace(/_/g, '-')] = item[1]})
    } else {
      new_obj[value[0].replace(/_/g, '-')] = value[1]
    }
  })
  // console.log("new inquiry: %j", new_obj)
  return new_obj
}
