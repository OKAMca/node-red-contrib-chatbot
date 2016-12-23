var _ = require('underscore');

module.exports = {

  /**
   * @method hasValidchatbot
   * Check if the message has a valid chatbot for a sender
   * @return {String}
   */
  hasValidchatbot: function(msg) {

    if (msg.chatbot == null) {
      return 'msg.chatbot is empty. The node connected to sender is passing an empty chatbot.';
    }
    if (msg.chatbot.chatId == null) {
      return 'msg.chatbot.chatId is empty. Ensure that a RedBot node is connected to the sender node, if the chatbot'
        + ' is the result of an elaboration from other nodes, connect it to a message node (text, image, etc.)';
    }
    if (msg.chatbot.type == null) {
      return 'msg.chatbot.type is empty. Unsupported message type.';
    }
    return null;
  },

  getChatId: function(msg) {
    if (_.isObject(msg.chatbot) && msg.chatbot.chatId != null) {
      return msg.chatbot.chatId;
    } else if (msg.originalMessage != null) {
      return msg.originalMessage.chat.id;
    } else {
      return null;
    }
  },

  getMessageId: function(msg) {
    if (_.isObject(msg.chatbot) && msg.chatbot.messageId != null) {
      return msg.chatbot.messageId;
    } else if (msg.originalMessage != null) {
      return msg.originalMessage.message_id;
    } else {
      return null;
    }
  },

  /**
   * @method matchContext
   * Test if topics match (intersection of arrays)
   * @param {String/Array} contexts
   * @param {String/Array} rules
   * @return {Boolean}
   */
  matchContext: function(contexts, rules) {
    contexts = contexts || [];
    rules = rules || [];
    if (rules === '*') {
      return true;
    }
    var arrayRules = _.isArray(rules) ? rules : rules.split(',');
    var arrayContexts = _.isArray(contexts) ? contexts : contexts.split(',');
    return _.intersection(arrayContexts, arrayRules).length !== 0;
  }

};
