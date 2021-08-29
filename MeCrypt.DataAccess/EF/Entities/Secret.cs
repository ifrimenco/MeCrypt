using MeCrypt.Common;
using System;
using System.Collections.Generic;

#nullable disable

namespace MeCrypt.DataAccess.EF.Entities
{
    public partial class Secret : IEntity
    {
        public Guid Id { get; set; }
        public Guid OpenerId { get; set; }
        public string Title { get; set; }
        public byte[] Content { get; set; }
        
        public virtual User Opener { get; set; } 
    }
}
