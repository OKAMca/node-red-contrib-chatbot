var _ = require('underscore');
var assert = require('chai').assert;
var RED = require('./lib/red-stub')();
var LanguageBlock = require('../chatbot-language');

describe('Chat language node', function() {

  it('should detect italian language', function() {
    var msg = RED.createMessage({
      content: 'hey guido come stai?',
      chatId: 42
    });
    RED.node.config({
      language: 'italian',
      mode: 'medium'
    });
    LanguageBlock(RED);
    RED.node.get().emit('input', msg);
    assert.equal(RED.node.message().chatbot.content, 'hey guido come stai?');
    assert.equal(RED.node.message().chatbot.chatId, 42);
    assert.equal(RED.node.message(1), null);
  });

  it('should not detect italian language', function() {
    var msg = RED.createMessage({
      content: 'hey guido come stai?',
      chatId: 42
    });
    RED.node.config({
      language: 'italian',
      mode: 'strict'
    });
    LanguageBlock(RED);
    RED.node.get().emit('input', msg);
    assert.equal(RED.node.message(1).chatbot.content, 'hey guido come stai?');
    assert.equal(RED.node.message(1).chatbot.chatId, 42);
    assert.equal(RED.node.message(0), null);
  });

  it('should pass through commands', function() {
    var msg = RED.createMessage({
      content: '/help',
      chatId: 42
    });
    RED.node.config({
      language: 'italian',
      mode: 'strict'
    });
    LanguageBlock(RED);
    RED.node.get().emit('input', msg);
    assert.equal(RED.node.message(0).chatbot.content, '/help');
    assert.equal(RED.node.message(0).chatbot.chatId, 42);
    assert.equal(RED.node.message(1), null);
  });

  it('should detect english language', function() {
    var msg = RED.createMessage({
      content: 'how you doing?',
      chatId: 42
    });
    RED.node.config({
      language: 'english',
      mode: 'medium'
    });
    LanguageBlock(RED);
    RED.node.get().emit('input', msg);
    assert.equal(RED.node.message().chatbot.content, 'how you doing?');
    assert.equal(RED.node.message().chatbot.chatId, 42);
    assert.equal(RED.node.message(1), null);
  });

});

