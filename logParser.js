var fs = require('fs');

module.exports = function(appInfo){
  return function(){
    return fs.readFileSync(appInfo.logPath, 'utf-8');
  };
};
