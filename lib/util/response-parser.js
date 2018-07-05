"use strict";

const messages = require('elasticio-node').messages;

module.exports = ParseResponse;

function ParseResponse(response) {

  var result = {};
  /** inspect data section **/
  if(response.data) {
    const data = response.data;
    if(data.type) {
      const type = data.type;
      const prefix = type.split('-').slice(-1)[0];
      result.data_type = type;
      result.data_prefix = prefix;
      if(data.id) { result[`${prefix}_id`] = data.id; }

      if(data.attributes) {
        const attributes = data.attributes;
        for(var key in attributes) {
          var new_key = key.replace(/-/g, '_');
          result[`${prefix}_${new_key}`] = attributes[key];
        }
      }

      if(data.relationships) {
        const relationships = data.relationships;
        for(var relation_name in relationships) {
          console.log("inspecting relation %s", relation_name);
        }
      }
    }
  }
  return messages.newMessageWithBody(result);

}
