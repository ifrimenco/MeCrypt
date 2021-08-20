using MeCrypt.Common;
using System;
using System.Collections.Generic;

#nullable disable

namespace MeCrypt.DataAccess.DataAccess.EF.Entities
{
    public partial class Permission : IEntity
    {
        public Permission()
        {
            RolePermissions = new HashSet<RolePermission>();
        }

        public int Id { get; set; }
        public string Title { get; set; }

        public virtual ICollection<RolePermission> RolePermissions { get; set; }
    }
}
