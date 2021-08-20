using MeCrypt.Common;
using System;
using System.Collections.Generic;

#nullable disable

namespace MeCrypt.DataAccess.DataAccess.EF.Entities
{
    public partial class Role : IEntity // IEntity nu e adaugat de context, e adaugat manual de mine
    {
        public Role()
        {
            RolePermissions = new HashSet<RolePermission>();
            UserRoles = new HashSet<UserRole>();
        }

        public int Id { get; set; }
        public string Title { get; set; }

        public virtual ICollection<RolePermission> RolePermissions { get; set; }
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}
