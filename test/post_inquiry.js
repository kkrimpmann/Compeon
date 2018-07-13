"use strict";
const expect = require('chai').expect
const inquiry = require('../lib/actions/post_inquiry.js')
const messages = require('elasticio-node').messages

exports.test = (() => {
  describe('post new inquiry existing user, existing company', function () {
    it('should complete successfully', function () {
      const new_inquiry = {
        user: {
          user_type: 'existing',
          email: 'max.mustermann2@example.com',
          password: '12345678'
        },
        company: {
          company_type: 'existing',
          id: 1688
        },
        inquiry: {
          excluded_bank_codes: [ '12345678' ],
          amount: 100000,
          consider_subsidies: false,
          favored_decision_date: '2018-04-24T22:31:06.125Z',
          purpose_kind: 'goods',
          product_kind: 'loan',
          purpose_kind_goods_detail: {
            goods_estimated_delivery_date: '2018-05-01T21:00:00.000+01:00',
            goods_purchase_price: 90000,
            goods_description: 'Ein tolles Ding',
            goods_supplier: 'Eine tolle Firma',
          },
          product_kind_loan_detail: {
            loan_kind: 'amortisable',
            loan_fixed_interest_rate: false,
            loan_term_in_months: 12,
            loan_already_on_hand_at_bank: false,
            loan_interested_in_alternative_financing: true
          }
        }
      }
      return inquiry.process(messages.newMessageWithBody(new_inquiry), {url: 'http://compeon.svc.my-cloudworks.de:3000'}).then(
        (response) => {
          expect(response).to.have.property('data')
          expect(response.data).to.have.property('id')
        }
      )
      Object.entries(new_inquiry).forEach((item) => {
        expect(result.body).to.have.property('inquiry').with.have.property(item[0]).with.equal(item[1])
      })
    })
  })
})
