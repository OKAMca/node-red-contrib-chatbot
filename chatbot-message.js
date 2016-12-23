var _ = require('underscore');
var utils = require('./lib/helpers/utils');
var MessageTemplate = require('./lib/message-template');
var emoji = require('node-emoji');

module.exports = function(RED) {

  function ChatBotMessage(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    this.message = config.message;
    this.answer = config.answer;
    this.parse_mode = config.parse_mode;
    this.transports = ['telegram', 'slack', 'facebook', 'smooch'];

    this.on('input', function(msg) {
      var message = node.message;
      var answer = node.answer;
      var parse_mode = node.parse_mode;
      var chatId = utils.getChatId(msg);
      var messageId = utils.getMessageId(msg);
      var template = MessageTemplate(msg, node);

      // check transport compatibility
      if (!_.contains(node.transports, msg.originalMessage.transport)) {
        node.error('This node is not available for transport: ' + msg.originalMessage.transport);
        return;
      }

      if (!_.isEmpty(node.message)) {
        message = node.message;
      } else if (_.isString(msg.chatbot) && !_.isEmpty(msg.chatbot)) {
        message = msg.chatbot;
      } else if (_.isNumber()) {
        message = String(msg.chatbot);
      } else {
        node.error('Empty message');
      }

      // chatbot
      msg.chatbot = {
        type: 'message',
        content: emoji.emojify(template(message)),
        chatId: chatId,
        messageId: messageId,
        inbound: false
      };

      msg.chatbot.options = {};
      // parse mode
      if (!_.isEmpty(parse_mode)) {
        msg.chatbot.options.parse_mode = parse_mode;
      }
      // reply flag
      if (answer) {
        msg.chatbot.options.reply_to_message_id = messageId;
      }
      // send out reply
      node.send(msg);
    });
  }

  RED.nodes.registerType('chatbot-message', ChatBotMessage);
};
