/// <reference path="libs/openrct2.d.ts" />

var main = () => {
    console.log("Hello, world!");
}

registerPlugin({
    name: 'Crowd Control',
    version: '1.0',
    authors: ['Milo Marten'],
    type: 'remote',
    licence: 'MIT',
    main: main
})