var _ = require('underscore');
var assert = require('chai').assert;
var RED = require('./lib/red-stub')();
var ImageBlock = require('../chatbot-image');

describe('Chat image node', function() {

  it('should send a image message from chatbot with telegram', function () {
    var msg = RED.createMessage(new Buffer('image'), 'telegram');
    RED.node.config({
      name: 'my file name: test'
    });
    ImageBlock(RED);
    RED.node.get().emit('input', msg);
    assert.equal(RED.node.message().chatbot.type, 'photo');
    assert.equal(RED.node.message().chatbot.inbound, false);
    assert.instanceOf(RED.node.message().chatbot.content, Buffer);
    assert.equal(RED.node.message().chatbot.filename, 'my file name test');
    assert.equal(RED.node.message().originalMessage.chat.id, 42);
  });

  /*it('should send a image message from chatbot with slack', function () {
    var msg = RED.createMessage('<image-binary>', 'slack');
    RED.node.config({
    });
    ImageBlock(RED);
    RED.node.get().emit('input', msg);
    assert.equal(RED.node.message().chatbot.type, 'photo');
    assert.equal(RED.node.message().chatbot.inbound, false);
    assert.instanceOf(RED.node.message().chatbot.content, Buffer);
    assert.equal(RED.node.message().originalMessage.chat.id, 42);
  });*/

});
