// YOUR CODE HERE:

// app.send({username: '~*~*~*~CASPER~*~*~*~', text: 'yaaaaayyyy!', roomname: '<script>console.log("I LOVE TO TROLLLLLLLL")</script>'})
var app = {
  server: 'https://api.parse.com/1/classes/messages',
  init: function() {
    this.fetch();
    this.handleSubmit();
    this.roomList();
    $('#chats').on('click', '.username', app.addFriend);
  },
  userFriends: {},
  send: function(object) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(object),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        console.log(data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  handleSubmit: function () {
    $('#formfield').submit(function(e) {
      e.preventDefault();
      var messageObj = {};
      messageObj.text = $('.chatInput').val();
      messageObj.username = name;
      messageObj.roomname = $('.roomInput').val();
      console.log(messageObj);
      app.send(messageObj);
      app.fetch();
    });
  },

  // 2. append a message to the DOM
  addMessage: function (item) {
    // use .text to escape attacks
    var message = item.text;
    var userLink = $('<a>').text(item.username).addClass('username');
    var msg = $('<li>').text(
      " message: " + message + 
      " created at:" + item.createdAt + 
      " room: " + item.roomname).prepend(userLink);
    $('#chats').append(msg);
  },

  addFriend: function () {
    var friend = $( this ).text();
    console.log(friend);
    app.userFriends[friend] = friend;
    console.log($(this));
    $(this).css('font-weight', 'bold');
  },

// 1. fetches chatbox
  fetch: function () {
    // a. empty the chatlist
    app.clearMessages();
    // b. use ajax call to get message data
    $.ajax({
      url: this.server,
      type: 'GET',
      contentType: 'application/jsonp',
      success: function (data) {
        // for each data object, append to the DOM
        data.results.forEach(function(datum) {
          app.addMessage(datum);
        });
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  addRoom: function(str) {
    var roomNode = $('<div>');
    roomNode.text(str);
    $('#roomSelect').append(str);
  },

// 3. Function to populate room list drop down
  roomList: function() {
    // a. use Ajax call to get room names
    $.ajax({
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        // clear the drop down list
        $('.mdl-menu').empty();

        // put all room names into an array
        var listOfRooms = _.map(data.results, function(item) { 
          return item.roomname || 'General'; 
        });

        // remove any dupplicates
        var uniqRooms = _.uniq(listOfRooms);
        // console.log(uniqRooms)
        var filteredResults = [];
        var index = 0;
        
        // for each unique room, create a button on the drop down
        uniqRooms.forEach(function(item) {
          // create a list element
          var link = $("<li class='mdl-menu__item " + index + "'>");
          link.text(item);
          $('.mdl-menu').append(link);

          // add a button for every room using classes
          $("." + index).on('click', function() {
            // empty the chat list
            app.clearMessages();

            // create a filtered array
            filteredResults = _.filter(data.results, function(datum) {
              if (item === 'General') {
                return typeof datum.roomname === 'undefined';
              }
              return datum.roomname === item;
            });

            // populate the current chat list from a specific room
            filteredResults.forEach(function(msg) {
              app.addMessage(msg);
            });
          // console.log(filteredResults)
          });
          index++;
        });
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

};


