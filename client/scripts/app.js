// YOUR CODE HERE:
$(document).ready(function(e) {

// 1. refreshes chatbox
window.refresh = function () {
  // a. empty the chatlist
  $('.chatList').empty();
  // b. use ajax call to get message data
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      // for each data object, append to the DOM
      data.results.forEach(function(datum) {
        appendMessageToPage(datum);
      });
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

// 2. append a message to the DOM
  var appendMessageToPage = function (item) {
    // use .text to escape attacks
    var message = item.text;
    var msg = $('<li>').text("username: " + item.username + 
      " message: " + message + 
      " created at:" + item.createdAt + 
      " room: " + item.roomname);
    $('.chatList').append(msg);
  
  };




// 3. Function to populate room list drop down
  window.roomList = function() {
    // a. use Ajax call to get room names
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
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
        var filteredResults = [];
        
        // for each unique room, create a button on the drop down
        uniqRooms.forEach(function(item) {
          // create a list element
          var link = "<li class='mdl-menu__item'>" + item + "</li>";
          $('.mdl-menu').append(link);

          // add a button for every room using classes
          $('.' + item).on('click', function() {
            // empty the chat list
            $('.chatList').empty();

            // create a filtered array
            filteredResults = _.filter(data.results, function(datum) {
              if (item === 'General') {
                return typeof datum.roomname === 'undefined';
              }
              return datum.roomname === item;
            });

            // populate the current chat list from a specific room
            filteredResults.forEach(function(msg) {
              console.log(x);
              appendMessageToPage(msg);
            });
          });
        });
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };


  $('#formfield').submit(function(e) {
    var inputValue = $('input').val();
    var messageObj = {};
    messageObj.text = inputValue;
    messageObj.username = name;
    messageObj.roomname = roomName;
    
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(messageObj),
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

    e.preventDefault();

  });

});