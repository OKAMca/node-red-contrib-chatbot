var _ = require('underscore');
var utils = require('./lib/helpers/utils');

module.exports = function(RED) {

  function ChatBotLocation(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    this.latitude = config.latitude;
    this.longitude = config.longitude;
    this.place = config.place;
    this.transports = ['telegram', 'slack', 'facebook'];

    this.on('input', function(msg) {

      var chatId = utils.getChatId(msg);
      var messageId = utils.getMessageId(msg);
      var latitude = node.latitude;
      var longitude = node.longitude;
      var place = node.place;

      if (_.isObject(msg.chatbot) && _.isNumber(msg.chatbot.latitude) && _.isNumber(msg.chatbot.longitude)) {
        latitude = msg.chatbot.latitude;
        longitude = msg.chatbot.longitude;
      }

      // send out the message
      msg.chatbot = {
        type: 'location',
        content: {
          latitude: latitude,
          longitude: longitude
        },
        place: place,
        chatId: chatId,
        messageId: messageId,
        inbound: false
      };

      node.send([msg, null]);
    });

  }

  RED.nodes.registerType('chatbot-location', ChatBotLocation);
};
