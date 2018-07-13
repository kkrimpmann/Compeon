"use strict";
const expect = require('chai').expect
const company = require('../lib/actions/company.js')
const messages = require('elasticio-node').messages

exports.test = (() => {
  describe('existing company', function () {
    it('should have company_type existing', function () {
      const existing_company = {id: 1668 }
      const result = company.process(messages.newMessageWithBody(existing_company), {})
      expect(result.body).to.have.property('company').with.have.property('company_type').with.equal('existing')
      Object.entries(existing_company).forEach((item) => {
        expect(result.body).to.have.property('company').with.have.property(item[0]).with.equal(item[1])
      })
    })
  })
  describe('new company', function () {
    it('should have company_type filled with all attributes', function () {
      const new_company = {
        street: "Hohe Straße 3",
        city: "Berlin",
        crefo_id: "7687104071",
        legal_form: "Haftungsbeschränkte Kommanditgesellschaft (GmbH & Co. KG)",
        name: "Mustermann GmbH&Co.KG",
        zip_code: "71925",
        turnover_class: "0_to_10_thousand",
        founding_year: 2000
      }
      const result = company.process(messages.newMessageWithBody(new_company), {})
      expect(result.body).to.have.property('company').with.have.property('company_type').with.equal('new')
      Object.entries(new_company).forEach((item) => {
        expect(result.body).to.have.property('company').with.have.property(item[0]).with.equal(item[1])
      })
    })
  })
})
