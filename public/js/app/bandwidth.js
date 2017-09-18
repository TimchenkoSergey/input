var Bandwidth = (function () {
    var changeBandwidth = null;

    return {
        init: init,
    };

    function init(changeBandwidthCallBack) {
        changeBandwidth = changeBandwidthCallBack;
        var selectWrapper = getSelect();
        var select = selectWrapper.querySelector('select');
        select.addEventListener('change', changeBandwidthHandler, false);

        return selectWrapper;
    }

    function getSelect() {
        var wrapper = document.createElement('div');

        wrapper.innerHTML = (
            '<select class="select-bandwidth tooltipped" data-position="top" data-tooltip="Качество видео">' +
                '<option value="1500" selected>Высокое</option>' +
                '<option value="500">Среднее</option>' +
                '<option value="125">Низкое</option>' +
            '</select>'
        );

        wrapper.className = 'select-bandwidth-wrapper';

        return wrapper;
    }

    function changeBandwidthHandler() {
        var select = this;
        var bandwidth = select.options[select.selectedIndex].value;

        changeBandwidth(bandwidth);
    }
})();