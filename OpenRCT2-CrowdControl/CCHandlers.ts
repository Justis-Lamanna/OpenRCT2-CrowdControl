/// <reference path="libs/openrct2.d.ts" />
/// <reference path="CCTypes.ts" />
/// <reference path="CCConstants.ts" />

function noop(result: GameActionResult): void { }

function rctMessage(text: string, type: ParkMessageType = "money") {
    park.postMessage({
        type: type,
        text: text
    });
}

function cheat(cheat: Cheat, p1: number = 0, p2: number = 0) {
    context.executeAction("setcheataction", {
        type: cheat,
        param1: p1,
        param2: p2
    }, noop);
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

function addMoney(effect: CCEffect, amount: number): CCStatus {
    cheat(Cheat.AddMoney, amount * 10);

    if (amount < 0) {
        rctMessage(`${effect.viewer} stole $${-amount}.00 from you!`);
    } else if (amount > 0) {
        rctMessage(`${effect.viewer} donated $${amount}.00 to you!`);
    }

    return CCStatus.SUCCESS;
}

function clearLoan(effect: CCEffect): CCStatus {
    cheat(Cheat.ClearLoan);

    rctMessage(`${effect.viewer} paid off your loan!`);

    return CCStatus.SUCCESS;
}

function spawnDucks(effect: CCEffect): CCStatus {
    cheat(Cheat.CreateDucks, 100);

    rctMessage(`${effect.viewer} released the ducks!`);

    return CCStatus.SUCCESS;
}

function despawnDucks(effect: CCEffect): CCStatus {
    cheat(Cheat.RemoveDucks);

    rctMessage(`${effect.viewer} killed all the ducks!`);

    return CCStatus.SUCCESS;
}

function goBackOneMonth(effect: CCEffect): CCStatus {
    const monthsElapsed = date.monthProgress;
    if (monthsElapsed == 0) {
        return CCStatus.RETRY;
    }
    date.monthProgress = monthsElapsed - 1;

    rctMessage(`${effect.viewer} forced the date to ${formatDate(date.day, date.month, date.year)}`);
    return CCStatus.SUCCESS;
}

function goBackToStart(effect: CCEffect): CCStatus {
    date.monthProgress = 0;
    date.monthsElapsed = 0;

    rctMessage(`${effect.viewer} forced the date to ${formatDate(date.day, date.month, date.year)}`);
    return CCStatus.SUCCESS;
}

function forceWin(effect: CCEffect): CCStatus {
    cheat(Cheat.WinScenario);

    rctMessage(`${effect.viewer} forced you to win!`);
    return CCStatus.SUCCESS;
}

function forceWeather(effect: CCEffect, weather?: number): CCStatus {
    if (!weather) {
        weather = context.getRandom(0, 9);
    }

    cheat(Cheat.ForceWeather, weather);

    rctMessage(`${effect.viewer} changed the weather!`);
    return CCStatus.SUCCESS;
}

function freezeWeather(effect: CCEffect): CCStatus {
    cheat(Cheat.FreezeWeather, 1);

    rctMessage(`${effect.viewer} halted weather changes!`);
    return CCStatus.SUCCESS;
}

function unfreezeWeather(effect: CCEffect): CCStatus {
    cheat(Cheat.FreezeWeather, 0);

    rctMessage(`The weather is back to normal now...`);
    return CCStatus.SUCCESS;
}

let handlers: { [key: string]: Handler } = {
    give100: new Handler((effect: CCEffect) => addMoney(effect, 100)),
    give1000: new Handler((effect: CCEffect) => addMoney(effect, 1000)),
    take100: new Handler((effect: CCEffect) => addMoney(effect, -100)),
    take1000: new Handler((effect: CCEffect) => addMoney(effect, -1000)),
    zeroLoan: new Handler(clearLoan),

    minusOneMonth: new Handler(goBackOneMonth),
    resetDate: new Handler(goBackToStart),
    forceWin: new Handler(forceWin),

    forceWeatherRandom: new Handler((effect: CCEffect) => forceWeather(effect)),
    forceWeather0: new Handler((effect: CCEffect) => forceWeather(effect, 0)),
    forceWeather1: new Handler((effect: CCEffect) => forceWeather(effect, 1)),
    forceWeather2: new Handler((effect: CCEffect) => forceWeather(effect, 2)),
    forceWeather3: new Handler((effect: CCEffect) => forceWeather(effect, 3)),
    forceWeather4: new Handler((effect: CCEffect) => forceWeather(effect, 4)),
    forceWeather5: new Handler((effect: CCEffect) => forceWeather(effect, 5)),
    forceWeather6: new Handler((effect: CCEffect) => forceWeather(effect, 6)),
    forceWeather7: new Handler((effect: CCEffect) => forceWeather(effect, 7)),
    forceWeather8: new Handler((effect: CCEffect) => forceWeather(effect, 8)),
    freezeWeather: new Handler(freezeWeather, unfreezeWeather),

    spawnDucks: new Handler(spawnDucks),
    clearDucks: new Handler(despawnDucks)
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