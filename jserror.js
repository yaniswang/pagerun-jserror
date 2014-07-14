var fs = require('fs');

module.exports = function(pagerun){
    var bOpenUrl = false;
    pagerun.on('proxyStart', function(msg){
        var proxy = msg.proxy;
        proxy.addFilter(function(httpData, next, end){
            if(bOpenUrl === true){
                var responseContent = httpData.responseContent;
                if(httpData.responseCode === 200 &&
                    responseContent !== undefined){
                    if(httpData.responseType === 'html'){
                        // add crossorigin
                        responseContent = responseContent.replace(/<script(\s+[^<>]*)?>\s*<\/script>/ig,function(all, attrs){
                            if(/src\s*=\s*['"][^'"]+/i.test(attrs) &&
                                /['"](https?)?\/\/pagerun\//.test(attrs) === false &&
                                /\s+crossorigin/.test(attrs) === false){
                                all = all.replace(/<script\s+/,'$&crossorigin ');
                            }
                            return all;
                        });
                        httpData.responseContent = responseContent;
                    }
                }
            }
            // add header: access-control-allow-origin
            var responseHeaders= httpData.responseHeaders;
            if(responseHeaders){
                responseHeaders['access-control-allow-origin'] = '*';
            }
            next();
        });
    });
    pagerun.on('webdriverOpenUrl', function(){
        bOpenUrl = true;
    });
    pagerun.injectCode('<script src="//pagerun/jserror.js"></script>', 'top');
    pagerun.addRequestMap('pagerun/jserror.js', {
        'responseCode': '200',
        'responseHeaders': {
            'Content-Type': 'application/javascript'
        },
        'responseData': fs.readFileSync(__dirname+'/jserror-client.js')
    });
};