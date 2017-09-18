var MuteMicro = (function () {
    var callBack = null;
    var microMuted = false;

    return {
        init: init,
    };

    function init(wrapperElement, clickCallBack) {
        var muteMicroWrapper = getMuteMicroButton();
        callBack = clickCallBack;
        wrapperElement.appendChild(muteMicroWrapper);
        muteMicroWrapper.querySelector('button').addEventListener('click', clickHandler, false);
    }

    function clickHandler() {
        var icon = this.querySelector('i');
        microMuted = !microMuted;

        if (microMuted) {
            Utils.replaceClasses(icon, 'fa-microphone', 'fa-microphone-slash');
        } else {
            Utils.replaceClasses(icon, 'fa-microphone-slash', 'fa-microphone');
        }

        callBack(microMuted);
    }

    function getMuteMicroButton() {
        var wrapper = document.createElement('div');

        wrapper.innerHTML = (
            '<button type="button" class="mute-micro-button">' +
                '<i class="fa fa-microphone-slash custom-icon-local" aria-hidden="true"></i>' +
            '</button>'
        );

        wrapper.className = 'mute-micro-wrapper';

        return wrapper;
    }
})();