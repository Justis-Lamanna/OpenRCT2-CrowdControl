using CrowdControl.Common;
using CrowdControl.Games.Packs;
using System;
using System.Collections.Generic;

namespace CrowdControl
{
    public class OpenRCT2 : SimpleTCPPack
    {
        public override string Host { get; } = "0.0.0.0";

        public override ushort Port { get; } = 43384;

        public OpenRCT2(IPlayer player, Func<CrowdControlBlock, bool> responseHandler, Action<object> statusUpdateHandler) :
            base(player, responseHandler, statusUpdateHandler)
        { }

        public override Game Game { get; } = new Game(90, "OpenRCT2", "OpenRCT2", "PC", ConnectorType.SimpleTCPConnector);

        public override List<Effect> Effects => new List<Effect> {
            new Effect("Test An Effect", "test")
        };
    }
}
