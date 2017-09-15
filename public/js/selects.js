var Selects = (function () {
    var videoElement = document.getElementById('localVideo');
    var audioInputSelect = document.getElementById('audio-input-select');
    var audioOutputSelect = document.getElementById('audio-output-select');
    var videoSelect = document.getElementById('video-select');
    var selectors = [audioInputSelect, audioOutputSelect, videoSelect];

    navigator.mediaDevices.enumerateDevices()
        .then(gotDevices)
        .catch(handleError);

    audioInputSelect.onchange = start;
    audioOutputSelect.onchange = changeAudioDestination;
    videoSelect.onchange = start;

    return {
        start: start,
    };

    function changeAudioDestination() {
        var audioDestination = audioOutputSelect.value;
        attachSinkId(videoElement, audioDestination);
    }

    function attachSinkId(element, sinkId) {
        if (typeof element.sinkId !== 'undefined') {
            element.setSinkId(sinkId)
            .then(function() {
                console.log('Success, audio output device attached: ' + sinkId);
            })
            .catch(function(error) {
                var errorMessage = error;

                if (error.name === 'SecurityError') {
                    errorMessage = 'You need to use HTTPS for selecting audio output ' + 'device: ' + error;
                }

                console.error(errorMessage);
                audioOutputSelect.selectedIndex = 0;
            });
        } else {
            console.warn('Browser does not support output device selection.');
        }
    }

    function gotDevices(deviceInfos) {
        // Handles being called several times to update labels. Preserve values.
        var values = selectors.map(function(select) {
            return select.value;
        });

        selectors.forEach(function(select) {
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }
        });

        for (var i = 0; i !== deviceInfos.length; ++i) {
            var deviceInfo = deviceInfos[i];
            var option = document.createElement('option');
            option.value = deviceInfo.deviceId;

            if (deviceInfo.kind === 'audioinput') {
                option.text = deviceInfo.label || 'microphone ' + (audioInputSelect.length + 1);
                audioInputSelect.appendChild(option);
            } else if (deviceInfo.kind === 'audiooutput') {
                option.text = deviceInfo.label || 'speaker ' + (audioOutputSelect.length + 1);
                audioOutputSelect.appendChild(option);
            } else if (deviceInfo.kind === 'videoinput') {
                option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
                videoSelect.appendChild(option);
            }
        }

        selectors.forEach(function(select, selectorIndex) {
            if (Array.prototype.slice.call(select.childNodes).some(function(n) {
                return n.value === values[selectorIndex];
            })) {
                select.value = values[selectorIndex];
            }
        });
    }

    function gotStream(stream) {
        window.stream = stream;
        videoElement.srcObject = stream;
        return navigator.mediaDevices.enumerateDevices();
    }

    function start() {
        if (window.stream) {
            window.stream.getTracks().forEach(function(track) {
                track.stop();
            });
        }

        var audioSource = audioInputSelect.value;
        var videoSource = videoSelect.value;
        var constraints = {
            audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
            video: { deviceId: videoSource ? { exact: videoSource } : undefined }
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(gotStream)
            .then(gotDevices)
            .catch(handleError);
    }

    function handleError(error) {
        console.log('navigator.getUserMedia error: ', error);
    }
})();