// Generated by CoffeeScript 1.7.1
var htmlEntities, name, pageTitleNotification;

name = '<slapjack>';

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
  var $content, $field, $joinButton, $joinGame, $name, $playGame, $sendButton, $username, joinGame, messages, sendMessage, socket, window_focus;
  window_focus = true;
  $(window).focus(function() {
    window_focus = true;
    pageTitleNotification.off();
    return true;
  });
  $(window).blur(function() {
    window_focus = false;
    return true;
  });
  messages = [];
  socket = io.connect(window.location.origin);
  $joinGame = $('#join-game');
  $username = $('#username');
  $joinButton = $('#join');
  $playGame = $('#play-game');
  $name = $('#name');
  $field = $('#field');
  $sendButton = $('#send');
  $content = $('#content');
  socket.on('message', function(data) {
    var html, i, _i, _ref;
    if (data.message) {
      messages.push(data);
      html = '';
      for (i = _i = 0, _ref = messages.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        html += "<strong>" + (htmlEntities(messages[i].username ? messages[i].username : 'Server')) + ":</strong> ";
        html += "" + (htmlEntities(messages[i].message)) + "<br>";
      }
      $content.html(html);
      $content.scrollTop($content[0].scrollHeight);
      if (data.username && data.username !== $name.val() && !window_focus) {
        pageTitleNotification.on("New Message!", 2000);
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
      name = $username.val();
      $name.html(name);
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
      text = $field.val();
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
