/// <reference path="libs/openrct2.d.ts" />

const port = 43384;
var enabled = false;

var main = () => {
    //Create two menu items, that allow for in-game stopping and starting of Crowd Control.
    ui.registerMenuItem("Start The Chaos", () => {
        enabled = true;
    });
    ui.registerMenuItem("Stop The Chaos", () => {
        enabled = false;
    });
}

registerPlugin({
    name: 'Crowd Control',
    version: '1.0',
    authors: ['Milo Marten'],
    type: 'remote',
    licence: 'MIT',
    main: main
});