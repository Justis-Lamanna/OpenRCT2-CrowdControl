/// <reference path="libs/openrct2.d.ts" />
/// <reference path="CCTypes.ts" />
/// <reference path="CCHandlers.ts" />

const port = 8081;
const TRACE = function (msg) { console.log(msg); }
const EOT = "\0";

let enabled = true;
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

    connect();

    //Handle renames as guests enter the park
    /*context.subscribe("guest.generation", (e) => {
        if (peepQueue.length > 0) {
            const peep = map.getEntity(e);
            if (peep != null && peep.type == "peep" && (peep as Peep).peepType == "guest") {
                context.executeAction("guestsetname", {
                    peep: peep.id,
                    name: peepQueue[0]
                }, noop);

                park.postMessage({
                    type: "peep",
                    text: peepQueue[0] + " has entered the park!",
                    subject: peep.id
                });

                peepQueue.shift();
            }
        }
    });*/

    context.registerAction("guestSetColor", (args: any) => {
        return {};
    }, (args: any) => {
        const peeps = map.getAllEntities("peep");
        const color = args.color;
        for (let i = 0; i < peeps.length; i++) {
            const peep = peeps[i];
            if (peep.peepType == "guest") {
                (peep as Guest).tshirtColour = color;
                (peep as Guest).trousersColour = color;
            }
        }
        return {};
    });

    context.registerAction("guestAddMoney", (args: any) => {
        return {}
    }, (args: any) => {
        const peeps = map.getAllEntities("peep");
        for (let i = 0; i < peeps.length; i++) {
            const peep = peeps[i];
            if (peep.peepType == "guest") {
                let cash = (peep as Guest).cash + args.money;
                if (cash < 0) {
                    cash = 0;
                } else if (cash > 1000) {
                    cash = 1000;
                }
                (peep as Guest).cash = cash;
            }
        }
        return {};
    });

    context.registerAction("killPlants", (args: any) => { return {} }, (args: any) => {
        for (let y = 0; y < map.size.y; y++) {
            for (let x = 0; x < map.size.x; x++) {
                const tile = map.getTile(x, y);
                for (var i = 0; i < tile.numElements; i++) {
                    const element = tile.getElement(i);
                    if (element.type == "small_scenery") {
                        (element as SmallSceneryElement).age = 100;
                    }
                }
            }
        }
        return {};
    });

    context.registerAction("breakThings", (args: any) => { return {} }, (args: any) => {
        for (let y = 0; y < map.size.y; y++) {
            for (let x = 0; x < map.size.x; x++) {
                const tile = map.getTile(x, y);
                for (var i = 0; i < tile.numElements; i++) {
                    const element = tile.getElement(i);
                    if (element.type == "footpath") {
                        (element as FootpathElement).isAdditionBroken = (context.getRandom(0, 10) == 0);
                    }
                }
            }
        }
        return {};
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