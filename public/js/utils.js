var Utils = (function () {
    return {
        log: log,
        errorHandler: errorHandler,
        setMediaBitrates: setMediaBitrates,
    };

    function log(str, obj) {
        console.log(str, obj);
    }

    function errorHandler(err) {
        console.error(err);
    }

    function setMediaBitrates(sdp, bandwidth) {
        return setMediaBitrate(setMediaBitrate(sdp, 'video', bandwidth), 'audio', 50);
    }

    function setMediaBitrate(sdp, media, bitrate) {
        var lines = sdp.split('\n');
        var line = -1;

        for (var i = 0; i < lines.length; i++) {
            if (lines[i].indexOf('m=' + media) === 0) {
                line = i;
                break;
            }
        }

        if (line === -1) {
            return sdp;
        }

        line++;

        while(lines[line].indexOf('i=') === 0 || lines[line].indexOf('c=') === 0) {
            line++;
        }

        if (lines[line].indexOf('b') === 0) {
            lines[line] = 'b=AS:' + bitrate;
            return lines.join('\n');
        }

        var newLines = lines.slice(0, line);
        newLines.push('b=AS:' + bitrate);
        newLines = newLines.concat(lines.slice(line, lines.length));

        return newLines.join('\n');
    }
})();
