// YOUR CODE HERE:
$(document).ready(function(e) {

window.refresh = function () {

  $('.chatList').empty();

$.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'https://api.parse.com/1/classes/messages',
  type: 'GET',
  contentType: 'application/json',
  success: function (data) {
    data.results.forEach(function(datum) {
      var message = datum.text + " ";
      // // console.log(message);
      var msg = $('<li>').text(datum.username + " " + message + "created at:" + datum.createdAt );
      $('.chatList').append(msg);
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