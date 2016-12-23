var _ = require('underscore');

module.exports = function(RED) {

  var yesWords = ['yes', 'on', 'true', 'yeah', 'ya', 'si'];
  var noWords = ['no', 'off', 'false', 'nei', 'nein'];

  var extractEmail = function(sentence) {
    var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    var matched = sentence.match(re);
    return matched != null ? matched[0] : null;
  };

  function ChatBotParse(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    this.parseType = config.parseType;
    this.parseVariable = config.parseVariable;

    this.on('input', function(msg) {
      msg = RED.util.cloneMessage(msg);
      var parseType = this.parseType;
      var parseVariable = this.parseVariable;
      var chatContext = msg.chat();

      var parsedValue = null;

      if (_.isObject(msg.chatbot)) {
        switch (parseType) {
          case 'string':
            parsedValue = msg.chatbot.content;
            break;
          case 'email':
            parsedValue = extractEmail(msg.chatbot.content);
            break;
          case 'location':
            if (_.isObject(msg.chatbot.content) && msg.chatbot.content.latitude && msg.chatbot.content.longitude) {
              parsedValue = msg.chatbot.content;
            }
            break;
          case 'boolean':
            if (_.isString(msg.chatbot.content) && _(yesWords).contains(msg.chatbot.content.toLowerCase())) {
              parsedValue = true;
            } else if (_.isString(msg.chatbot.content) && _(noWords).contains(msg.chatbot.content.toLowerCase())) {
              parsedValue = false;
            }
            break;
          case 'photo':
          case 'audio':
            if (msg.chatbot.content instanceof Buffer) {
              parsedValue = msg.chatbot.content;
            }
            break;
          case 'contact':
            if (_.isObject(msg.chatbot.content) && msg.chatbot.content.phone_number != null) {
              parsedValue = msg.chatbot.content.phone_number;
            }
            break;
        }
      }

      // if parsing ok, then pass through and set variable in context flow
      if (parsedValue != null) {
        if (chatContext != null) {
          chatContext.set(parseVariable, parsedValue);
        }
        msg.chatbot = parsedValue;
        node.send([msg, null]);
      } else {
        node.send([null, msg]);
      }

    });
  }
  RED.nodes.registerType('chatbot-parse', ChatBotParse);

};
