var Socket = (function () {
    var socket = io.connect('', { port: 8080 });

    return {
        socket: socket,
        sendMessage: sendMessage,
    };

    function sendMessage(message){
        socket.emit('message', message);
    }
})();