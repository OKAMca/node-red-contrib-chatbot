var _ = require('underscore');
var ChatContextStore = require('./lib/chat-context-store');

module.exports = function(RED) {

  function ChatBotConversation(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    this.chatId = config.chatId;
    this.transport = config.transport;

    this.on('input', function(msg) {

      var chatId = node.chatId;
      var transport = node.transport;

      // ensure the original message is injected
      msg.originalMessage = {
        chat: {
          id: chatId
        },
        message_id: null,
        transport: transport
      };
      msg.chat = function() {
        return ChatContextStore.getOrCreateChatContext(node, chatId, {
          chatId: chatId,
          transport: transport,
          authorized: true
        });
      };

      // fix chat id in chatbot if any
      if (_.isObject(msg.chatbot) && msg.chatbot.chatId != null) {
        msg.chatbot.chatId = chatId;
      }

      node.send(msg);
    });

  }

  RED.nodes.registerType('chatbot-conversation', ChatBotConversation);
};
