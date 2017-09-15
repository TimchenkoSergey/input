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
        microMuted = !microMuted;
        callBack(microMuted);
    }

    function getMuteMicroButton() {
        var wrapper = document.createElement('div');

        wrapper.innerHTML = (
            '<button type="button" class="mute-micro-button">Mute</button>'
        );

        wrapper.className = 'mute-micro-wrapper';

        return wrapper;
    }
})();