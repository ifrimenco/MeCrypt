using System;
using System.Collections.Generic;

namespace MeCrypt.DataObjects.DTOs
{
    public class MessageListItemModel
    {
        public Guid SenderId { get; set; }
        public string CryptedContent { get; set; }
    }
}

