/// <reference path="libs/openrct2.d.ts" />
/// <reference path="CCTypes.ts" />
/// <reference path="CCUtils.ts" />
/// <reference path="CCAds.ts" />

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

    rctMessage(`${effect.viewer} sped up the chain lifts!`);
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

    rctMessage(`${effect.viewer} slowed down the chain lifts!`);
    return CCStatus.SUCCESS;
}

let peepQueue: string[] = [];

function peepNameAfterDonator(effect: CCEffect): CCStatus {
    peepQueue.push(effect.viewer);
    return CCStatus.SUCCESS;
}

function peepRandomColor(effect: CCEffect): CCStatus {
    const color = context.getRandom(0, 31);

    context.executeAction("guestSetColor", { color: color }, noop);

    rctMessage(`${effect.viewer} changed the fashion!`)
    return CCStatus.SUCCESS;
}

function peepHungry(effect: CCEffect): CCStatus {
    cheat(Cheat.SetGuestParameter, 2, 0);
    rctMessage(`${effect.viewer} made the guests ravenous.`);
    return CCStatus.SUCCESS;
}

function peepFull(effect: CCEffect): CCStatus {
    cheat(Cheat.SetGuestParameter, 2, 255);
    rctMessage(`${effect.viewer} made the guests stuffed.`);
    return CCStatus.SUCCESS;
}

function peepThirsty(effect: CCEffect): CCStatus {
    cheat(Cheat.SetGuestParameter, 3, 0);
    rctMessage(`${effect.viewer} made the guests very thirsty.`);
    return CCStatus.SUCCESS;
}

function peepQuench(effect: CCEffect): CCStatus {
    cheat(Cheat.SetGuestParameter, 3, 255);
    rctMessage(`${effect.viewer} made the guests no longer thirsty.`);
    return CCStatus.SUCCESS;
}

function peepPee(effect: CCEffect): CCStatus {
    cheat(Cheat.SetGuestParameter, 6, 255);
    rctMessage(`${effect.viewer} made the guests need to use the restroom.`);
    return CCStatus.SUCCESS;
}

function peepNoPee(effect: CCEffect): CCStatus {
    cheat(Cheat.SetGuestParameter, 6, 0);
    rctMessage(`${effect.viewer} made the guests no longer need to use the restroom.`);
    return CCStatus.SUCCESS;
}

function peepGiveCash(effect: CCEffect, amount: number): CCStatus {
    context.executeAction("guestAddMoney", { money: amount }, noop);
    if (amount < 0) {
        rctMessage(`${effect.viewer} stole $${amount}.00 from all the guests.`)
    } else if (amount > 0) {
        rctMessage(`${effect.viewer} gave $${amount}.00 to all the guests.`)
    }
    return CCStatus.SUCCESS;
}

function peepGiveBalloon(effect: CCEffect): CCStatus {
    cheat(Cheat.GiveAllGuests, 2);
    rctMessage(`${effect.viewer} gave everyone a balloon!`);
    return CCStatus.SUCCESS;
}

function removeLitter(effect: CCEffect): CCStatus {
    cheat(Cheat.RemoveLitter);
    rctMessage(`${effect.viewer} cleaned the place up!`);
    return CCStatus.SUCCESS;
}

function mowGrass(effect: CCEffect): CCStatus {
    cheat(Cheat.SetGrassLength, 0);
    rctMessage(`${effect.viewer} mowed the lawn!`);
    return CCStatus.SUCCESS;
}

function unmowGrass(effect: CCEffect): CCStatus {
    cheat(Cheat.SetGrassLength, 100);
    rctMessage(`${effect.viewer} made the grass grow!`);
    return CCStatus.SUCCESS;
}

function waterPlants(effect: CCEffect): CCStatus {
    cheat(Cheat.WaterPlants);
    rctMessage(`${effect.viewer} watered the plants!`);
    return CCStatus.SUCCESS;
}

function killPlants(effect: CCEffect): CCStatus {
    context.executeAction("killPlants", {}, noop);
    rctMessage(`${effect.viewer} killed the plants!`);
    return CCStatus.SUCCESS;
}

function breakThings(effect: CCEffect): CCStatus {
    context.executeAction("breakThings", {}, noop);
    rctMessage(`${effect.viewer} broke things!`);
    return CCStatus.SUCCESS;
}

function fixThings(effect: CCEffect): CCStatus {
    cheat(Cheat.FixVandalism);
    rctMessage(`${effect.viewer} fixed things!`);
    return CCStatus.SUCCESS;
}

function spawnRandomWindows(effect: CCEffect): CCStatus {
    if (ui) {
        const randomNumber = context.getRandom(1, 6);
        for (let i = 0; i < randomNumber; i++) {
            showRandomAd();
        }
        return CCStatus.SUCCESS;
    }
    return CCStatus.FAILED;
}

function closeAllWindows(effect: CCEffect): CCStatus {
    if (ui) {
        ui.closeAllWindows();
        rctMessage(`${effect.viewer} closed your windows!`);
    }
    return CCStatus.FAILED;
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

    //peepNameAfterDonator: new Handler(peepNameAfterDonator),
    peepRecolor: new Handler(peepRandomColor),
    peepFeed: new Handler(peepFull),
    peepUnfeed: new Handler(peepHungry),
    peepDrink: new Handler(peepQuench),
    peepUndrink: new Handler(peepThirsty),
    peepFillBladder: new Handler(peepPee),
    peepEmptyBladder: new Handler(peepNoPee),
    peepGiveMoney: new Handler((effect: CCEffect) => peepGiveCash(effect, 20)),
    peepTakeMoney: new Handler((effect: CCEffect) => peepGiveCash(effect, -20)),
    peepGiveBalloon: new Handler(peepGiveBalloon),

    cleanPaths: new Handler(removeLitter),
    mowGrass: new Handler(mowGrass),
    unmowGrass: new Handler(unmowGrass),
    waterPlants: new Handler(waterPlants),
    burnPlants: new Handler(killPlants),
    smashScenery: new Handler(breakThings),
    fixScenery: new Handler(fixThings),

    spawnDucks: new Handler(spawnDucks),
    clearDucks: new Handler(despawnDucks),

    openRandomWindows: new Handler(spawnRandomWindows),
    closeAllWindows: new Handler(closeAllWindows)
};

function handle(effect: CCEffect): CCStatus {
    const handler = handlers[effect.code];
    if (handler && effect.type == CCRequestType.START) {
        return handler.startEffect(effect);
    } else if (handler && effect.type == CCRequestType.STOP) {
        return handler.stopEffect(effect);
    } else {
        return CCStatus.FAILED;
    }
}