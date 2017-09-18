var ControlsForRemote = (function () {
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
        addVolumeBarHandler(wrapperElement.querySelector('.volume-bar'), wrapperElement.querySelector('.mute-button'));
    }

    function addPlayButtonHandler(button) {
        button.addEventListener('click', function() {
            var icon = this.querySelector('i');

            if (videoElement.paused === true) {
                videoElement.play();
                Utils.replaceClasses(icon, 'fa-play', 'fa-stop');
            } else {
                videoElement.pause();
                Utils.replaceClasses(icon, 'fa-stop', 'fa-play');
            }
        });
    }

    function addMuteButtonHandler(button, volumeBar) {
        button.addEventListener('click', function() {
            var icon = this.querySelector('i');

            if (videoElement.muted === false) {
                videoElement.muted = true;
                prevVolumeValue = volumeBar.value;
                volumeBar.value = 0;
                Utils.replaceClasses(icon, 'fa-volume-off', ['fa-volume-down', 'fa-volume-up']);

            } else {
                videoElement.muted = false;
                volumeBar.value = prevVolumeValue;
                if (prevVolumeValue >= 0.5) {
                    Utils.replaceClasses(icon, 'fa-volume-up', 'fa-volume-off');
                } else {
                    Utils.replaceClasses(icon, 'fa-volume-down', 'fa-volume-off');
                }
            }
        });
    }

    function addFullScreenButtonHandler(button) {
        var isFullScreen = false;

        button.addEventListener('click', function() {
            var icon = this.querySelector('i');

            if(!isFullScreen){
                if (videoElement.requestFullscreen) {
                    videoElement.requestFullscreen();
                } else if (videoElement.mozRequestFullScreen) {
                    videoElement.mozRequestFullScreen();
                } else if (videoElement.webkitRequestFullscreen) {
                    videoElement.webkitRequestFullscreen();
                }

                Utils.replaceClasses(icon, 'fa-compress', 'fa-expand');
                document.querySelector('body').className = 'full-screen';
                isFullScreen = true;
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }

                Utils.replaceClasses(icon, 'fa-expand', 'fa-compress');
                document.querySelector('body').className = '';
                isFullScreen = false;
            }
        });
    }

    function addVolumeBarHandler(bar, button) {
        bar.addEventListener('change', function() {
            videoElement.volume = bar.value;

            var icon = button.querySelector('i');
            if (bar.value >= 0.5) {
                Utils.replaceClasses(icon, 'fa-volume-up', ['fa-volume-down', 'fa-volume-off']);
            } else if (+bar.value === 0) {
                Utils.replaceClasses(icon, 'fa-volume-off', ['fa-volume-down', 'fa-volume-up']);
            } else {
                Utils.replaceClasses(icon, 'fa-volume-down', ['fa-volume-off', 'fa-volume-up']);
            }
        });
    }

    function getControlsElement() {
        var wrapper = document.createElement('div');

        wrapper.innerHTML = (
            '<button type="button" class="play-button waves-effect btn-flat">' +
                '<i class="fa fa-stop custom-icon custom-green" aria-hidden="true"></i>' +
            '</button>' +
            '<button type="button" class="mute-button waves-effect btn-flat">' +
                '<i class="fa fa-volume-up custom-icon custom-green" aria-hidden="true"></i>' +
            '</button>' +
            '<input type="range" class="volume-bar custom-green" min="0" max="1" step="0.1" value="1">'
        );

        wrapper.className = 'remote-video-controls clearfix';

        wrapper.appendChild(Bandwidth.init(changeBandwidthCallBack));

        wrapper.innerHTML += (
            '<button type="button" class="full-screen-button waves-effect btn-flat">' +
                '<i class="fa fa-expand custom-icon custom-green" aria-hidden="true"></i>' +
            '</button>'
        );

        return wrapper;
    }
})();