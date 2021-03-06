// Generated by CoffeeScript 1.7.1
var htmlEntities, name, pageTitleNotification;

name = '&lt;anon&gt;';

htmlEntities = function(string) {
  return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

pageTitleNotification = {
  vars: {
    originalTitle: document.title,
    interval: null
  },
  on: function(notification, intervalSpeed) {
    var that;
    if (intervalSpeed == null) {
      intervalSpeed = 1000;
    }
    that = this;
    that.vars.interval = setInterval(function() {
      return document.title = that.vars.originalTitle === document.title ? notification : that.vars.originalTitle;
    }, intervalSpeed);
    return true;
  },
  off: function() {
    clearInterval(this.vars.interval);
    document.title = this.vars.originalTitle;
    return true;
  }
};

$(function() {
  var $content, $field, $joinButton, $joinGame, $name, $playGame, $sendButton, $username, $window, joinGame, logs, sendMessage, socket, windowFocus;
  $window = $(window);
  windowFocus = true;
  socket = io.connect(window.location.origin);
  logs = [];
  $joinGame = $('#join-game');
  $username = $('#username');
  $joinButton = $('#join');
  $playGame = $('#play-game');
  $content = $('#content');
  $name = $('#name');
  $field = $('#field');
  $sendButton = $('#send');
  $window.on('focus', function(event) {
    windowFocus = true;
    pageTitleNotification.off();
    return true;
  });
  $window.on('blur', function(event) {
    windowFocus = false;
    return true;
  });
  socket.on('message', function(data) {
    var $message, text, username;
    if (data.message) {
      logs.push(data);
      username = data.username ? data.username : 'Server';
      text = data.message;
      $message = $('<div>', {
        "class": 'message'
      });
      $message.append($('<strong>', {
        html: "" + username + ": "
      }));
      $message.append(text);
      $content.append($message);
      $content.scrollTop($content.prop('scrollHeight'));
      if (data.username && username !== name && !windowFocus) {
        pageTitleNotification.off();
        pageTitleNotification.on("" + username + " says " + text, 1500);
      }
    } else {
      console.log("There is a problem: " + data);
    }
    return true;
  });
  joinGame = function() {
    if ($username.val() === '') {
      alert('Please type your name!');
    } else {
      name = htmlEntities($username.val());
      $name.html(name);
      socket.emit('send', {
        message: "<em>" + name + " just joined the chat</em>"
      });
      $joinGame.collapse('hide');
      $playGame.collapse('show');
      $field.trigger('focus');
    }
    return true;
  };
  $joinButton.on('click', function(event) {
    joinGame();
    return true;
  });
  $username.on('keydown', function(event) {
    if (event.keyCode === 13) {
      joinGame();
    }
    return true;
  });
  sendMessage = function() {
    var text;
    if (name === '') {
      alert('Please type your name!');
    } else {
      text = htmlEntities($field.val());
      socket.emit('send', {
        username: name,
        message: text
      });
      $field.val('');
    }
    return true;
  };
  $sendButton.on('click', function(event) {
    sendMessage();
    return true;
  });
  $field.on('keydown', function(event) {
    if (event.keyCode === 13) {
      sendMessage();
    }
    return true;
  });
  $username.trigger('focus');
});
