var fs = require('fs');

module.exports = function(pagerun){
    pagerun.injectCode('<script src="//pagerun/jserror.js"></script>', 'top');
    pagerun.addRequestMap('pagerun/jserror.js', {
        'responseCode': '200',
        'responseHeaders': {
            'Content-Type': 'application/javascript'
        },
        'responseData': fs.readFileSync(__dirname+'/jserror-client.js')
    });
};