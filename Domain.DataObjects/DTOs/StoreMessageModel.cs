using System;
using System.Collections.Generic;

namespace MeCrypt.DataObjects.DTOs
{
    public class StoreMessageModel
    {
        public Guid RoomId { get; set; }
        public List<Tuple<Guid, string>> UserMessages { get; set; }
    }
}