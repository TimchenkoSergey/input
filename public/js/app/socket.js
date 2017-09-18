var Socket = (function () {
    var socket = io.connect('', { port: 8080 });

    return {
        socket: socket,
        sendMessage: sendMessage,
    };

    function sendMessage(message) {
        message.roomId = Constants.roomId;
        socket.emit('message', message);
    }
})();