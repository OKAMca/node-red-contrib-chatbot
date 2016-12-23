var _ = require('underscore');
var moment = require('moment');
var fs = require('fs');

module.exports = function(chatContext) {

  var self = {

    log: function(msg, fileName) {
      return new Promise(function(resolve) {
        if (chatContext == null || _.isEmpty(fileName)) {
          // resolve immediately if empty and do nothing
          resolve(msg);
        } else {
          fs.appendFile(fileName, self.message(msg) + '\n', function (err) {
            if (err) {
              console.error(err);
            }
            // resolve anyway, problem on logging should not stop the chatbot
            resolve(msg);
          });
        }
      });
    },

    message: function(msg) {

      var chatId = chatContext.get('chatId');
      var inbound = msg.chatbot != null && msg.chatbot.inbound === true;
      var firstName = chatContext.get('firstName');
      var lastName = chatContext.get('lastName');
      var logString = null;

      var name = [];
      if (firstName != null ) {
        name.push(firstName);
      }
      if (lastName != null ) {
        name.push(lastName);
      }

      if (_.isObject(msg.chatbot)) {

        switch(msg.chatbot.type) {
          case 'message':
            logString = msg.chatbot.content.replace(/\n/g, '');
            break;
          case 'location':
            logString = 'latitude: ' + msg.chatbot.content.latitude + ' longitude: ' + msg.chatbot.content.latitude;
            break;
          case 'photo':
            logString = 'image: ' + (msg.chatbot.filename != null ? msg.chatbot.filename : '<buffer>');
            break;
          case 'audio':
            logString = 'audio: ' + (msg.chatbot.filename != null ? msg.chatbot.filename : '<buffer>');
            break;
          default:
            var content = msg.chatbot.content instanceof Buffer ? '<buffer>' : String(msg.chatbot.content);
            logString = content.replace(/\n/g, '');
        }
        logString = chatId + ' '
            + (!_.isEmpty(name) ? '[' + name.join(' ') + '] ' : '')
            + (inbound ? '> ' : '< ')
            + moment().toString() + ' - ' + logString;
      }

      return logString;
    }
  };

  return self;
};
