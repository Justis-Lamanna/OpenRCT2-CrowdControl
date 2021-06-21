/// <reference path="libs/openrct2.d.ts" />
/// <reference path="CCTypes.ts" />
/// <reference path="CCHandlers.ts" />

const port = 8081;
const TRACE = function (msg) { console.log(msg); }
const EOT = "\0";

let enabled = false;
let socket: Socket = network.createSocket().setNoDelay(true);

function respond(response: CCResponse): void {
    const responseStr = JSON.stringify(response);
    TRACE("Responding with " + responseStr);
    socket.write(responseStr + EOT);
}

var main = () => {
    function connect() {
        socket.connect(port, "127.0.0.1", () => {
            TRACE("Received connection to Crowd Control");
        });
    }

    socket.on("data", (data) => {
        data = data.slice(0, -1); //Incoming from CC has weird ending character that messes things up.
        TRACE("Received raw data >" + data + "<");
        const json: CCEffect = JSON.parse(data);
        if (enabled) {
            respond({
                id: json.id,
                status: handle(json)
            });
        } else {
            respond({
                id: json.id,
                status: CCStatus.NOT_AVAILABLE,
                msg: "Crowd Control not enabled in OpenRCT2"
            });
        }
    }).on("error", (error) => {
        TRACE("Encountered an error: " + error + ", attempting reconnect");
        connect();
    }).on("close", () => {
        TRACE("Connection was closed, attempting reconnect");
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