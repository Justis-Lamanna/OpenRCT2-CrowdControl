/// <reference path="libs/openrct2.d.ts" />
/// <reference path="CCTypes.ts" />
/// <reference path="CCUtils.ts" />

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

function isBrokenDown(ride: Ride): boolean {
    return (ride.lifecycleFlags & 192) != 0;
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
    const monthsElapsed = date.monthProgress - 1;
    if (monthsElapsed < 0) {
        return CCStatus.RETRY;
    }
    const year = Math.floor(monthsElapsed / 8);
    const month = monthsElapsed % 8;
    context.executeAction("parksetdate", {
        year: year + 1,
        month: month + 1,
        day: date.day
    }, noop);

    rctMessage(`${effect.viewer} forced the date to ${formatDate(date.day, month + 1, year + 1)}`);
    return CCStatus.SUCCESS;
}

function goBackToStart(effect: CCEffect): CCStatus {
    context.executeAction("parksetdate", {
        year: 1,
        month: 1,
        day: 1
    }, noop);

    rctMessage(`${effect.viewer} forced the date to March, Year 1`);
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

function fixAllRides(effect: CCEffect): CCStatus {
    cheat(Cheat.FixRides);

    rctMessage(`${effect.viewer} fixed all the rides!`);
    return CCStatus.SUCCESS;
}

function fastChainLifts(effect: CCEffect): CCStatus {
    cheat(Cheat.FastLiftHill, 1);

    for (let i = 0; i < map.numRides; i++) {
        const ride = map.getRide(i);
        if (ride.classification == "ride") {
            context.executeAction("ridesetsetting", {
                ride: ride.id,
                setting: 8,
                value: 100
            }, noop);
        }
    }

    rctMessage(`${effect.viewer} sped up the chain lifts`);
    return CCStatus.SUCCESS;
}

function slowChainLifts(effect: CCEffect): CCStatus {
    cheat(Cheat.FastLiftHill, 1);

    for (let i = 0; i < map.numRides; i++) {
        const ride = map.getRide(i);
        if (ride.classification == "ride") {
            context.executeAction("ridesetsetting", {
                ride: ride.id,
                setting: 8,
                value: 1
            }, noop);
        }
    }

    rctMessage(`${effect.viewer} slowed down the chain lifts`);
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

    fixAllRides: new Handler(fixAllRides),
    fastChainLift: new Handler(fastChainLifts),
    slowChainLift: new Handler(slowChainLifts),

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