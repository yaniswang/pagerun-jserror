var fs = require('fs');

module.exports = function(pagerun){
    var self = this;
    var bOpenUrl = false;
    pagerun.on('proxyStart', function(msg){
        var proxy = msg.proxy;
        var jserrorClientContent = fs.readFileSync(__dirname+'/jserror-client.js');
        proxy.addFilter(function(httpData, next, end){
            if(bOpenUrl === true){
                var responseContent = httpData.responseContent;
                if(httpData.responseCode === 200 &&
                    httpData.responseType === 'html' &&
                    responseContent !== undefined){
                    httpData.responseContent = responseContent.replace(/<\/title>/i, '$&<script type="text/javascript" src="http://pagerun/jserror.js" charset="utf-8"></script>');
                }
                else if(httpData.type === 'request' && httpData.hostname === 'pagerun'){
                    switch(httpData.path){
                        case '/jserror.js':
                            httpData.responseCode = '200';
                            httpData.responseHeaders = {
                                'Content-Type': 'application/javascript'
                            };
                            httpData.responseData = jserrorClientContent;
                            break;
                    }
                    if(httpData.responseCode){
                        return end();
                    }
                }
            }
            next();
        });
    });
    pagerun.on('webdriverOpenUrl', function(){
        bOpenUrl = true;
    });
};