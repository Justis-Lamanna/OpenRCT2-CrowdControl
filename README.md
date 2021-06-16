# OpenRCT2-CrowdControl
Crowd Control plugins for OpenRCT2

Contained within this project are two important pieces of code:
1. `OpenRCT2.cs` contains the list of Crowd Control effects, and must be loaded into your Crowd Control SDK for testing.
2. `CCPlugin.ts` contains the plugin code for RCT2. It must be transpiled into JavaScript, and loaded into the /plugin directory of your OpenRCT2 instance.

## CCPlugin
* Run `npm run build` to transpile the CCPlugin. The output is `out/CCPlugin.js`.
* Run `npm run release` to transpile and minify the CCPlugin. The output is `out/CCPlugin.min.js`.
