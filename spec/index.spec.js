'use strict';

var traverse = require('../index');
var assert = require('assert');

describe('json-schema-traverse', function() {
  var calls;

  beforeEach(function() {
    calls = [];
  });

  it('should traverse all keywords containing schemas recursively', function() {
    var schema = require('./fixtures/schema').schema;
    var expectedCalls = require('./fixtures/schema').expectedCalls;

    traverse(schema, {pre: callback});
    assert.deepStrictEqual(calls, expectedCalls);
  });

  describe('Legacy v0.3.1 API', function() {
    it('should traverse all keywords containing schemas recursively', function() {
      var schema = require('./fixtures/schema').schema;
      var expectedCalls = require('./fixtures/schema').expectedCalls;

      traverse(schema, callback);
      assert.deepStrictEqual(calls, expectedCalls);
    });

    it('should work when an options object is provided', function() {
      // schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex
      var schema = require('./fixtures/schema').schema;
      var expectedCalls = require('./fixtures/schema').expectedCalls;

      traverse(schema, {}, callback);
      assert.deepStrictEqual(calls, expectedCalls);
    });
  });


  describe('allKeys option', function() {
    var schema = {
      someObject: {
        minimum: 1,
        maximum: 2
      }
    };

    it('should traverse objects with allKeys: true option', function() {
      // schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex
      var expectedCalls = [
        [schema, '', schema, undefined, undefined, undefined, undefined],
        [schema.someObject, '/someObject', schema, '', 'someObject', schema, undefined]
      ];

      traverse(schema, {allKeys: true}, callback);
      assert.deepStrictEqual(calls, expectedCalls);
    });


    it('should NOT traverse objects with allKeys: false option', function() {
      // schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex
      var expectedCalls = [
        [schema, '', schema, undefined, undefined, undefined, undefined]
      ];

      traverse(schema, {allKeys: false}, callback);
      assert.deepStrictEqual(calls, expectedCalls);
    });


    it('should NOT traverse objects without allKeys option', function() {
      // schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex
      var expectedCalls = [
        [schema, '', schema, undefined, undefined, undefined, undefined]
      ];

      traverse(schema, callback);
      assert.deepStrictEqual(calls, expectedCalls);
    });


    it('should NOT travers objects in standard keywords which value is not a schema', function() {
      var schema2 = {
        const: {foo: 'bar'},
        enum: ['a', 'b'],
        required: ['foo'],
        another: {

        },
        patternProperties: {}, // will not traverse - no properties
        dependencies: true, // will not traverse - invalid
        properties: {
          smaller: {
            type: 'number'
          },
          larger: {
            type: 'number',
            minimum: {$data: '1/smaller'}
          }
        }
      };

      // schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex
      var expectedCalls = [
        [schema2, '', schema2, undefined, undefined, undefined, undefined],
        [schema2.another, '/another', schema2, '', 'another', schema2, undefined],
        [schema2.properties.smaller, '/properties/smaller', schema2, '', 'properties', schema2, 'smaller'],
        [schema2.properties.larger, '/properties/larger', schema2, '', 'properties', schema2, 'larger'],
      ];

      traverse(schema2, {allKeys: true}, callback);
      assert.deepStrictEqual(calls, expectedCalls);
    });
  });

  describe('pre and post', function() {
    var schema;

    beforeEach(function() {
      schema = {
        type: 'object',
        properties: {
          name: {type: 'string'}
        }
      };
    });

    function pre(child) {
      child.preTraversed = true;
      if(child.type === 'string')
        // In the child object.
        assert(schema.preTraversed, 'Should traverse parents before children');
    }

    function post(child) {
      child.postTraversed = true;
      if(child.type === 'string')
        // In the child object.
        assert(!schema.postTraversed, 'Should traverse children before parents');
    }

    it('should traverse schema in pre-order', function() {
      traverse(schema, {pre});
      assert(schema.preTraversed, 'Should travese the schema');
    });

    it('should traverse schema in post-order', function() {
      traverse(schema, {post});
      assert(schema.postTraversed, 'Should travese the schema');
    });

    it('should traverse schema in pre- and post-order at the same time', function() {
      traverse(schema, {pre, post});
      assert(schema.preTraversed && schema.postTraversed, 'Should travese the schema');
    });
  });

  function callback() {
    calls.push(Array.prototype.slice.call(arguments));
  }
});
