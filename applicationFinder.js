var fs = require('fs');
var plist = require('plist');
var path = require('path');

/**
 * @param {string} os
 * @param {string} device
 * @returns a full path of the location of the queried device
 */
var findSimulatorDirectory = function(os, device){
  var baseDir = process.env['HOME'] + '/Library/Developer/CoreSimulator/Devices';

  // Find the current simulator
  var file = fs.readFileSync(path.join(baseDir, 'device_set.plist'), 'utf-8');
  var obj = plist.parse(file);

  return path.join(baseDir, obj['DefaultDevices']['com.apple.CoreSimulator.SimRuntime.' + os]['com.apple.CoreSimulator.SimDeviceType.' + device]);
};

/**
 * @param {string} os
 * @param {string} device
 * @returns a collection of the full paths of the application hashes for a given device/os combination
 */
var findApplicationCollectionHash = function(os, device){
  var simulatorDir = findSimulatorDirectory(os, device);
  var appendedPath = path.join(simulatorDir, 'data/Containers/Data/Application');
  return fs.readdirSync(appendedPath).map(function(file){
      return path.join(appendedPath ,file);
  });
};

/**
 * @param {string} filePath of the application hash
 * @returns a stat object of the application hash
 */
var getFileStats = function(filePath){
  return fs.statSync(filePath);
};

/**
 * @param {string} appPath
 * @returns a full path to the used log on the application path
 */
var getLogpath = function(appPath){
  var joinedPath = path.join(appPath, 'Library/Caches/Logs');
  return path.join(joinedPath, fs.readdirSync(joinedPath).find(function(element, index, array){
    return !/.*\.archived\.(?=log)/.test(element);
  }));
};

/**
 * @param {string} appPath
 * @returns a full path to the used path for storing the database
 */
var getDBPath = function(appPath){
  var joinedPath = path.join(appPath, 'Documents');
  return path.join(joinedPath, fs.readdirSync(joinedPath).find(function(element, index, array){
    return /.*\.sqlite$/.test(element);
  }));
};

/**
 * @param {string} os
 * @param {string} device
 * @returns a full path to the most recently updated application hash
 */
var mostRecentAppPath = function(os, device){
  return findApplicationCollectionHash(os, device)
  .map(function(path){
    var stats = getFileStats(path);
    stats.path = path;
    return stats;
  })
  .reduce(function(a,b,index){
    if(a.mtime === undefined){
      return b;
    }else if(b.mtime === undefined){
      return a;
    }else{
      return (a.mtime.getTime() > b.mtime.getTime() && a) || b;
    }
  }, {});
};

module.exports = function(os, device){
  var root = mostRecentAppPath(os, device).path;
  return {
    root: root,
    dbPath: getDBPath(root),
    logPath: getLogpath(root)
  };
};
