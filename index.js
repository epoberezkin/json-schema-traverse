'use strict';

var traverse = module.exports = function (schema, cb) {
  _traverse(schema, cb, '', schema);
};


traverse.keywords = {
  additionalItems: true,
  items: true,
  contains: true,
  additionalProperties: true,
  propertyNames: true,
  not: true
};

traverse.arrayKeywords = {
  items: true,
  allOf: true,
  anyOf: true,
  oneOf: true
};

traverse.propsKeywords = {
  definitions: true,
  properties: true,
  patternProperties: true,
  dependencies: true
};


function _traverse(schema, cb, jsonPtr, rootSchema, parentKeyword, parentSchema, keyIndex) {
  if (schema && typeof schema == 'object' && !Array.isArray(schema)) {
    cb(schema, jsonPtr, rootSchema, parentKeyword, parentSchema, keyIndex);
    for (var key in schema) {
      var sch = schema[key];
      if (Array.isArray(sch)) {
        if (key in traverse.arrayKeywords) {
          for (var i=0; i<sch.length; i++) {
            _traverse(sch[i], cb, jsonPtr + '/' + key + '/' + i, rootSchema, key, schema, i);
          }          
        }
      } else if (key in traverse.keywords) {
        _traverse(sch, cb, jsonPtr + '/' + key, rootSchema, key, schema);
      } else if (key in traverse.propsKeywords && sch && typeof sch == 'object') {
        for (var prop in sch) {
          _traverse(sch[prop], cb, jsonPtr + '/' + key + '/' + escapeJsonPtr(prop), rootSchema, key, schema, prop);
        }
      }
    }
  }
}


function escapeJsonPtr(str) {
  return str.replace(/~/g, '~0').replace(/\//g, '~1');
}
