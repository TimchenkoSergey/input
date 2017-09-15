var Constants = (function () {
    var offerOptions = { 'mandatory': { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } };
    var server = {
        iceServers: [{
            'urls': 'turn:172.104.142.142:3478?transport=udp',
            'credential': '3TptDG7cAfz5TaXsda',
            'username': 'prouser',
            'credentialType': 'password'
        }],
        iceTransportPolicy: 'relay'
    };
    var userOptions = { audio: true, video: true };
    var bandwidth = 1500;

    return {
        offerOptions: offerOptions,
        server: server,
        userOptions: userOptions,
        bandwidth: bandwidth,
    };
})();