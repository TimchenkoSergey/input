var ShareScreen = (function () {
    var callBack = null;

    return {
        init: init,
    };

    function init(wrapperElement, clickCallBack) {
        var shareScreenWrapper = getShareScreenButton();
        callBack = clickCallBack;
        wrapperElement.appendChild(shareScreenWrapper);
        shareScreenWrapper.querySelector('button').addEventListener('click', clickHandler, false);
    }

    function clickHandler() {
        /*var icon = this.querySelector('i');
        microMuted = !microMuted;

        if (microMuted) {
            Utils.replaceClasses(icon, 'fa-microphone', 'fa-microphone-slash');
        } else {
            Utils.replaceClasses(icon, 'fa-microphone-slash', 'fa-microphone');
        }*/

        callBack();
    }

    function getShareScreenButton() {
        var wrapper = document.createElement('div');

        wrapper.innerHTML = (
            '<button type="button" class="share-screen-button">' +
                '<i class="fa fa-desktop custom-icon-local" aria-hidden="true"></i>' +
            '</button>'
        );

        wrapper.className = 'share-screen-wrapper';

        return wrapper;
    }
})();