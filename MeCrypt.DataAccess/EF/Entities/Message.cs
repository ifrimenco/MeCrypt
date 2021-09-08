using MeCrypt.Common;
using System;
using System.Collections.Generic;

#nullable disable

namespace MeCrypt.DataAccess.EF.Entities
{
    public partial class Message : IEntity
    {
        public Guid Id { get; set; }
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }
        public Guid RoomId { get; set; }
        public string CryptedContent { get; set; }
        public DateTimeOffset DateTimeSent { get; set; }
        public int Lifespan { get; set; }

        public virtual UserRoom Sender { get; set; }
        public virtual UserRoom Receiver { get; set; }
    }
}
