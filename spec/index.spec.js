'use strict';

var traverse = require('../index');
var assert = require('assert');

describe('json-schema-traverse', function() {
  it('should traverse all keywords containing schemas recursively', function() {
    var calls = [];

    var schema = require('./fixtures/schema').schema;
    var expectedCalls = require('./fixtures/schema').expectedCalls;

    traverse(schema, callback);
    assert.deepStrictEqual(calls, expectedCalls);


    function callback() {
      calls.push(Array.prototype.slice.call(arguments));
    }
  });
});
