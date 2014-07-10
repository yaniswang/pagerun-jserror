(function(){
    window.onerror = function(message, file, line) {
        pagerun.error('jserror', {
            message: message,
            file: file,
            line: line
        });
        return true;
    };
})();