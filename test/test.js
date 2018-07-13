"use strict";
const expect = require('chai').expect
const user = require('../lib/actions/user.js')
const messages = require('elasticio-node').messages

describe('existing user', function () {
  it('should have user_type existing', function () {
    const existing_user = {email: 'test@test.com', password: 'top_secret' }
    const result = user.process(messages.newMessageWithBody(existing_user), {})
    expect(result.body).to.have.property('user').with.have.property('user_type').with.equal('existing')
    Object.entries(existing_user).forEach((item) => {
      expect(result.body).to.have.property('user').with.have.property(item[0]).with.equal(item[1])
    })
  })
})
describe('new user', function () {
  it('should have user_type filled with all attributes', function () {
    const new_user = {
      email: 'test@test.com',
      password: 'top_secret',
      first_name: 'Tester',
      last_name: 'Test',
      salutation: 'mr',
      telephone: '+49 211 / 78943158',
      mobile_phone: '+49 152 034 75896',
      terms_and_conditions_accepted: true
    }
    const result = user.process(messages.newMessageWithBody(new_user), {})
    expect(result.body).to.have.property('user').with.have.property('user_type').with.equal('new')
    Object.entries(new_user).forEach((item) => {
      expect(result.body).to.have.property('user').with.have.property(item[0]).with.equal(item[1])
    })
  })
})
