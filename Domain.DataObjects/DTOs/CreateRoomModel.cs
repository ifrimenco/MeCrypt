using System;
using System.Collections.Generic;

namespace MeCrypt.DataObjects.DTOs
{
    public class CreateRoomModel
    {
        public string Name { get; set; }
        public List<Guid> Users { get; set; }
    }
}