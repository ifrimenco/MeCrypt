using MeCrypt.Common;
using System;
using System.Collections.Generic;

#nullable disable

namespace MeCrypt.DataAccess.EF.Entities
{
    public partial class User : IEntity
    {
        public User()
        {
            CreatedRooms = new HashSet<Room>();
            UserRoles = new HashSet<UserRole>();
            UserRooms = new HashSet<UserRoom>();
        }

        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PasswordHash { get; set; }
        public string PublicKey { get; set; }

        public virtual ICollection<Room> CreatedRooms { get; set; }
        public virtual ICollection<UserRole> UserRoles { get; set; }
        public virtual ICollection<UserRoom> UserRooms { get; set; }
    }
}
