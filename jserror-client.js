(function(){
    window.onerror = function(message, file, line) {
        pagerun.result('jserror', {
            message: message,
            file: file,
            line: line
        });
        return true;
    };
})();