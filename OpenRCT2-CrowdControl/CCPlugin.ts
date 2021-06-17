/// <reference path="libs/openrct2.d.ts" />

const port = 8081;
let enabled = false;
let connected = false;
let socket: Socket = network.createSocket();

interface CCEffect {
    id: number;
    code: string;
    viewer: string;
    type: number;
}

function handleEffect(effect: CCEffect) {
    park.postMessage({
        type: "money",
        text: effect.viewer + " redeemed an effect: " + effect.code
    });
}

var main = () => {
    function connect() {
        socket.connect(port, "127.0.0.1", () => {
            console.log("Received connection to Crowd Control");
            connected = true;
        });
    }

    socket.on("data", (data) => {
        data = data.slice(0, -1); //Incoming from CC has weird ending character that messes things up.
        console.log("Received raw data >" + data + "<");
        if (enabled) {
            handleEffect(JSON.parse(data));
        }
    }).on("error", (error) => {
        connected = false;
        console.log("Encountered an error: " + error + ", attempting reconnect");
        connect();
    }).on("close", () => {
        connected = false;
        console.log("Connection was closed, attempting reconnect");
        connect();
    });

    //Create two menu items, that allow for in-game stopping and starting of Crowd Control.
    ui.registerMenuItem("Start The Chaos", () => {
       enabled = true;
    });

    ui.registerMenuItem("Stop The Chaos", () => {
        enabled = false;
    });

    connect();
}

registerPlugin({
    name: 'Crowd Control',
    version: '1.0',
    authors: ['Milo Marten'],
    type: 'remote',
    licence: 'MIT',
    main: main
});