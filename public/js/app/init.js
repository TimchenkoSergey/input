(function () {
    $('.modal').modal();
    $('.tooltipped').tooltip({ delay: 30 });

    window.addEventListener('load', function () {
        Socket.socket.emit('join', { roomId: Constants.roomId });
    }, true);
})();