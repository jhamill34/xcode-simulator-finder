# XCode Simulator Finder #
Looks for the last running simulator container. 

## Options ##

### os ###
The ios version that you are looking for (eg. iOS-9-3)

*yes those are dashes instead of dots*

### device ###
The device that you are querying for (eg. iPad-Air-2)

*again those are dashes instead of spaces*

### Return type ###
If you don't specify anything the returned value is just JSON including all relevant paths. Including the root directory 

#### db ####
Returns just a string indicating the path to go to for the sqlite database, assuming that you have a sqlite database in
the Documents directory. 

#### logs ###
Returns just a string indicating the path to go to for the log files for your device, again assuming that you have .log
files in your Documents directory. 


