"use strict";
const expect = require('chai').expect
const inquiry = require('../lib/actions/inquiry.js')
const messages = require('elasticio-node').messages

exports.test = (() => {
  describe('new inquiry', function () {
    it('should have inquiry_type filled with all attributes', function () {
      const new_inquiry = {
        excluded_bank_codes: [ '12345678' ],
        amount: 100000,
        consider_subsidies: false,
        favored_decision_date: '2018-04-24T22:31:06.125Z',
        purpose_kind: 'goods',
        product_kind: 'loan'
      }
      const result = inquiry.process(messages.newMessageWithBody(new_inquiry), {})
      Object.entries(new_inquiry).forEach((item) => {
        expect(result.body).to.have.property('inquiry').with.have.property(item[0]).with.equal(item[1])
      })
    })
  })
})
