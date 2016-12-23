var _ = require('underscore');
var utils = require('./lib/helpers/utils');
var MessageTemplate = require('./lib/message-template.js');
var emoji = require('node-emoji');

module.exports = function(RED) {

  function ChatBotAsk(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    this.answers = config.answers;
    this.message = config.message;
    this.inline = config.inline;
    this.transports = ['telegram', 'facebook', 'smooch'];

    this.on('input', function(msg) {

      var chatId = utils.getChatId(msg);
      var messageId = utils.getMessageId(msg);
      var template = MessageTemplate(msg, node);
      var answers = null;
      var message = null;

      // check transport compatibility
      if (!_.contains(node.transports, msg.originalMessage.transport)) {
        node.error('This node is not available for transport: ' + msg.originalMessage.transport);
        return;
      }
      // get from config or chatbot
      if (_.isArray(node.answers) && !_.isEmpty(node.answers)) {
        answers = node.answers;
      } else if (_.isObject(msg.chatbot) && _.isArray(msg.chatbot.buttons) && !_.isEmpty(msg.chatbot.buttons)) {
        answers = msg.chatbot.buttons;
      }
      // get from config or chatbot
      if (_.isString(node.message) && !_.isEmpty(node.message)) {
        message = node.message;
      } else if (_.isObject(msg.chatbot) && _.isString(msg.chatbot.message) && !_.isEmpty(msg.chatbot.message)) {
        message = msg.chatbot.message;
      }

      msg.chatbot = {
        type: 'buttons',
        content: message != null ? emoji.emojify(template(message)) : null,
        chatId: chatId,
        messageId: messageId,
        buttons: answers
      };

      node.send(msg);
    });

  }

  RED.nodes.registerType('chatbot-ask', ChatBotAsk);
};
