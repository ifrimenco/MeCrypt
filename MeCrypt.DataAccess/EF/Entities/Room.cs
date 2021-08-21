using MeCrypt.Common;
using System;
using System.Collections.Generic;

#nullable disable

namespace MeCrypt.DataAccess.EF.Entities
{
    public partial class Room : IEntity
    {
        public Room()
        {
            UserRooms = new HashSet<UserRoom>();
        }

        public Guid Id { get; set; }
        public Guid CreatorId { get; set; }
        public int MessageLifespan { get; set; }

        public virtual User Creator { get; set; }
        public virtual ICollection<UserRoom> UserRooms { get; set; }
    }
}
