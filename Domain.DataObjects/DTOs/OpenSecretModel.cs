using System;
using System.Collections.Generic;
using System.Numerics;

namespace MeCrypt.DataObjects.DTOs
{
    public class OpenSecretModel
    {
        public Guid SecretId { get; set; }
        public List<string> Shares { get; set; }
    }
}
