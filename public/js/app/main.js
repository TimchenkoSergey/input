(function () {
    var callButton = document.getElementById('callButton');
    var localVideoElement = document.getElementById('localVideo');
    var remoteVideoElement = document.getElementById('remoteVideo');
    var bandwidth = Constants.bandwidth;
    var localStream;
    var peerConnection;
    var isCall = false;
    var currentOfferMessage;

    ControlsForRemote.init(document.querySelector('.remote-video-wrapper'), changeBandwidth);
    MuteMicro.init(document.querySelector('.local-video-actions'), muteLocalMicrophone);
    //ShareScreen.init(document.querySelector('.local-video-actions'), shareScreen);
    Selects.start();

    callButton.addEventListener('click', createOffer, true);
    document.querySelector('#call-modal #take').addEventListener('click', takeCall, true);
    document.querySelector('#call-modal #reject').addEventListener('click', rejectCall, true);
    navigator.getUserMedia(Constants.userOptions, gotLocalStream, Utils.errorHandler);

    function rejectCall() {
        callButton.classList.remove('display-none');
    }

    function shareScreen() {
        console.log('share screen');
    }

    function muteLocalMicrophone(mute) {
        localStream.getAudioTracks()[0].enabled = !mute;
    }

    function changeBandwidth(newBandwidth) {
        bandwidth = newBandwidth;
        createOffer();
    }

    function gotLocalStream(stream) {
        localStream = stream;
        localVideoElement.srcObject = stream;

        peerConnection = new RTCPeerConnection(Constants.server);
        peerConnection.addStream(stream);
        peerConnection.onicecandidate = gotIceCandidate;
        peerConnection.onaddstream = gotRemoteStream;
        peerConnection.oniceconnectionstatechange = onIceConnectionStateChange;
    }
    
    function onIceConnectionStateChange() {
        if (peerConnection.iceConnectionState === 'disconnected') {
            Materialize.toast('Пользователь отключился!', 5000);
            isCall = false;
            callButton.classList.remove('display-none');
        }
    }

    function createOffer() {
        peerConnection.createOffer(gotLocalDescription, Utils.errorHandler, Constants.offerOptions);
    }

    function createAnswer() {
        peerConnection.createAnswer(gotLocalDescription, Utils.errorHandler, Constants.offerOptions);
    }

    function gotLocalDescription(description) {
        var desc = {
            type: description.type,
            sdp: Utils.setMediaBitrates(description.sdp, bandwidth)
        };

        peerConnection.setLocalDescription(description);
        Socket.sendMessage(desc);
    }

    function gotIceCandidate(event) {
        if (event.candidate) {
            Socket.sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        }
    }

    function gotRemoteStream(event) {
        callButton.classList.add('display-none');
        remoteVideoElement.srcObject = event.stream;
    }

    function takeCall() {
        createAnswer();
        isCall = true;
        $('#call-modal').modal('close');
    }

    function onGotOffer(message) {
        Utils.log('Got offer from server: ', message);
        peerConnection.setRemoteDescription(message);
        currentOfferMessage = message;

        if (!isCall) {
            $('#call-modal').modal('open');
        } else {
            createAnswer();
        }
    }

    Socket.socket.on('message', function (message) {
        switch (message.type) {
            case 'offer': {
                onGotOffer(message);
                break;
            }
            case 'answer': {
                Utils.log('Got answer from server: ', message);
                peerConnection.setRemoteDescription(message);
                break;
            }
            case 'candidate': {
                Utils.log('Got candidate from server: ', message);
                var candidate = new RTCIceCandidate({ sdpMLineIndex: message.label, candidate: message.candidate });
                peerConnection.addIceCandidate(candidate);
                break;
            }
        }
    });
})();
