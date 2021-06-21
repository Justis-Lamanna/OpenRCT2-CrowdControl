/// <reference path="libs/openrct2.d.ts" />
/// <reference path="CCTypes.ts" />

function rctMessage(text: string) {
    park.postMessage({
        type: "money",
        text: text
    });
}

class Handler {
    startEffect: (effect: CCEffect) => CCStatus;
    stopEffect: (effect: CCEffect) => CCStatus;

    constructor(
        startEffect: (effect: CCEffect) => CCStatus,
        stopEffect: (effect: CCEffect) => CCStatus = (effect) => CCStatus.SUCCESS) {
        this.startEffect = startEffect;
        this.stopEffect = stopEffect;
    }
}

let handlers: { [key: string]: Handler } = {

};

function handle(effect: CCEffect): CCStatus {
    const handler = handlers[effect.code];
    if (handler && effect.type == CCRequestType.START) {
        return handler.startEffect(effect);
    } else if (handler && effect.type == CCRequestType.STOP) {
        return handler.stopEffect(effect);
    } else {
        return CCStatus.NOT_AVAILABLE;
    }
}