using CrowdControl.Common;
using CrowdControl.Games.Packs;
using System;
using System.Collections.Generic;

namespace CrowdControl
{
    public class OpenRCT2 : SimpleTCPPack
    {
        public override string Host { get; } = "127.0.0.1";

        public override ushort Port { get; } = 8081;

        public OpenRCT2(IPlayer player, Func<CrowdControlBlock, bool> responseHandler, Action<object> statusUpdateHandler) :
            base(player, responseHandler, statusUpdateHandler)
        { }

        public override Game Game { get; } = new Game(90, "OpenRCT2", "OpenRCT2", "PC", ConnectorType.SimpleTCPConnector);

        public override List<Effect> Effects => new List<Effect> {
            new Effect("Money", "money", ItemKind.Folder),
            new Effect("Give $100", "give100", "money"),
            new Effect("Give $1000", "give1000", "money"),
            new Effect("Take $100", "take100", "money"),
            new Effect("Take $1000", "take1000", "money"),
            new Effect("Clear Loan", "zeroLoan", "money"),

            new Effect("Time Travel", "timeTravel", ItemKind.Folder),
            new Effect("Go Back One Month", "minusOneMonth", "timeTravel"),
            new Effect("Go Back To March Year 1", "resetDate", "timeTravel"),
            new Effect("Force Scenario Win", "forceWin", "timeTravel"),

            new Effect("Weather", "_weather", ItemKind.Folder),
            new Effect("Change Weather", "changeWeather", new[]{"weather"}, "_weather"),
            new Effect("Random Weather", "randomWeather", "_weather"),
            new Effect("Freeze Weather", "freezeWeather", "_weather"),

            new Effect("Rides", "rides", ItemKind.Folder),
            new Effect("Unlock Random Ride", "unlockRide", "rides"),
            new Effect("Unlock Random Coaster", "unlockCoaster", "rides"),
            new Effect("Unlock Random Shop", "unlockShop", "rides"),
            new Effect("Fix a Ride", "fixRide", "rides"),
            new Effect("Fix All Rides", "fixAllRides", "rides"),
            new Effect("Break a Ride", "breakRide", "rides"),
            new Effect("Fast Chain Lifts for 1 min", "fastChainLift", "rides"),

            new Effect("Peeps", "peeps", ItemKind.Folder),
            new Effect("Name Peep After Me", "peepNameAfterDonator", "peeps"),
            new Effect("Recolor Peeps", "peepRecolor", "peeps"),
            new Effect("Feed Peeps", "peepFeed", "peeps"),
            new Effect("Make Peeps Hungry", "peepUnfeed", "peeps"),
            new Effect("Quench Peeps", "peepDrink", "peeps"),
            new Effect("Make Peeps Thirsty", "peepUndrink", "peeps"),
            new Effect("Fill Peeps Bladders", "peepFillBladder", "peeps"),
            new Effect("Empty Peeps' Bladders", "peepEmptyBladder", "peeps"),
            new Effect("Give Peeps Money", "peepGiveMoney", "peeps"),
            new Effect("Take Peeps' Money", "peepTakeMoney", "peeps"),
            new Effect("Give Peeps Balloons", "peepGiveBalloon", "peeps"),
            new Effect("Release Peeps' Balloons", "peepReleaseBalloon", "peeps"),

            new Effect("Scenery", "scenery", ItemKind.Folder),
            new Effect("Clean Paths", "cleanPaths", "scenery"),
            new Effect("Mow Grass", "mowGrass", "scenery"),
            new Effect("Unmow Grass", "unmowGrass", "scenery"),
            new Effect("Water Plants", "waterPlants", "scenery"),
            new Effect("Burn Plants", "burnPlants", "scenery"),
            new Effect("Smash Scenery", "smashScenery", "scenery"),

            new Effect("Spawn Ducks", "spawnDucks"),
            new Effect("Clear Ducks", "clearDucks"),
            new Effect("Open Random Windows", "openRandomWindows"),
            new Effect("Close All Windows", "closeAllWindows")
        };


        public override List<ItemType> ItemTypes => new List<ItemType> {
            new ItemType("Weather", "weather", ItemType.Subtype.ItemList, "Sunny,Partly Cloudy,Cloudy,Rain,Heavy Rain,Thunderstorm,Snow,Heavy Snow,Blizzard")
        };
    }
}
