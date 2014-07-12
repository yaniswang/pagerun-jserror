(function(){
    window.onerror = function(message, file, line, col, errorObj) {
        var errorMessage = {
            message: message,
            file: file,
            line: line
        };
        if(col){
            errorMessage.col = col;
        }
        if(errorObj && errorObj.stack){
            errorMessage.stack = errorObj.stack;
        }
        pagerun.error('jserror', errorMessage);
        return true;
    };
    var doc = document;
    doc._oldCreateElement = doc.createElement;
    doc.createElement = function(tagname){
        var result = doc._oldCreateElement.apply(doc, arguments);
        if(/^script$/i.test(tagname)){
            result.setAttribute('crossorigin', true);
        }
        return result;
    }
})();