using MeCrypt.Common;
using System;
using System.Collections.Generic;

#nullable disable

namespace MeCrypt.DataAccess.EF.Entities
{
    public partial class UserRoom : IEntity
    {
        public UserRoom()
        {
            ReceivedMessages = new HashSet<Message>();
            SentMessages = new HashSet<Message>();
        }

        public Guid UserId { get; set; }
        public Guid RoomId { get; set; }

        public virtual Room Room { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<Message> ReceivedMessages { get; set; }
        public virtual ICollection<Message> SentMessages { get; set; }
    }
}
