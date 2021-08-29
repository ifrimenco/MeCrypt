using System;
using System.Collections.Generic;
using System.Numerics;

namespace MeCrypt.DataObjects.DTOs
{
    public class GetSecretModel
    {
        public Guid secretId { get; set; }
        public List<BigInteger> Shares { get; set; }
    }
}
