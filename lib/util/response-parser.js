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
          const relation = relationships[relation_name];
          if(relation.data) {
            const rel_data = relation.data;
            const rel_type = rel_data.type;
            const rel_id = rel_data.id;
            console.log("relation type is %s with id %d", rel_type, rel_id);
            if(response.included) {
              for(var inc_idx in response.included) {
                const inc = response.included[inc_idx];
                console.log("inspecting include %j", inc);
                if( (inc.type === rel_type) && (inc.id === rel_id) ) {
                  console.log("found include for relation type %s with id %d", rel_type, rel_id);
                  const rel_attributes = inc.attributes;
                  for(var att_name in rel_attributes) {
                    const new_att_name = att_name.replace(/-/g, '_');
                    result[`${relation_name}_${new_att_name}`] = rel_attributes[att_name];
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return messages.newMessageWithBody(result);

}
