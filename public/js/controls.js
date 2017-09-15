var Controls = (function () {
    var videoElement = null;
    var prevVolumeValue = 0;
    var changeBandwidthCallBack = null;

    return {
        init: init,
        addPlayButtonHandler: addPlayButtonHandler,
        addMuteButtonHandler: addMuteButtonHandler,
        addFullScreenButtonHandler: addFullScreenButtonHandler,
        addVolumeBarHandler: addVolumeBarHandler,
        getControlsElement: getControlsElement,
    };

    function init(wrapperElement, changeBandwidth) {
        changeBandwidthCallBack = changeBandwidth;
        videoElement = wrapperElement.querySelector('video');
        wrapperElement.appendChild(getControlsElement());

        addPlayButtonHandler(wrapperElement.querySelector('.play-button'));
        addMuteButtonHandler(wrapperElement.querySelector('.mute-button'), wrapperElement.querySelector('.volume-bar'));
        addFullScreenButtonHandler(wrapperElement.querySelector('.full-screen-button'));
        addVolumeBarHandler(wrapperElement.querySelector('.volume-bar'));
    }

    function addPlayButtonHandler(button) {
        button.addEventListener('click', function() {
            (videoElement.paused === true) ? videoElement.play() : videoElement.pause();
        });
    }

    function addMuteButtonHandler(button, volumeBar) {
        button.addEventListener('click', function() {
            if (videoElement.muted === false) {
                videoElement.muted = true;
                prevVolumeValue = volumeBar.value;
                volumeBar.value = 0;
            } else {
                videoElement.muted = false;
                volumeBar.value = prevVolumeValue;
            }
        });
    }

    function addFullScreenButtonHandler(button) {
        var isFullScreen = false;

        button.addEventListener('click', function() {
            if(!isFullScreen){
                if (videoElement.requestFullscreen) {
                    videoElement.requestFullscreen();
                } else if (videoElement.mozRequestFullScreen) {
                    videoElement.mozRequestFullScreen();
                } else if (videoElement.webkitRequestFullscreen) {
                    videoElement.webkitRequestFullscreen();
                }

                isFullScreen = true;
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }

                isFullScreen = false;
            }
        });
    }

    function addVolumeBarHandler(bar) {
        bar.addEventListener('change', function() {
            videoElement.volume = bar.value;
        });
    }

    function getControlsElement() {
        var wrapper = document.createElement('div');

        wrapper.innerHTML = (
            '<button type="button" class="play-button">Play</button>' +
            '<button type="button" class="mute-button">Mute</button>' +
            '<input type="range" class="volume-bar" min="0" max="1" step="0.1" value="1">' +
            '<button type="button" class="full-screen-button">Full-Screen</button>'
        );

        wrapper.className = 'video-controls';

        wrapper.appendChild(Bandwidth.init(changeBandwidthCallBack));

        return wrapper;
    }
})();