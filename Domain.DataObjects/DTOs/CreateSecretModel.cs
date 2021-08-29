using System;
using System.Collections.Generic;

namespace MeCrypt.DataObjects.DTOs
{
    public class CreateSecretModel
    {
        public string Content { get; set; }
        public string Title { get; set; }
        public List<Tuple<Guid, int>> UserSecrets { get; set; }
        public int MinimumShares { get; set; }
    }
}