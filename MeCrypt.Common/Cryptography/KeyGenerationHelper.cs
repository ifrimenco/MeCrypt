using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MeCrypt.Common
{
    public static class KeyGeneratorHelper
    {
        public static Tuple<byte[], byte[]> GenerateKeys()
        {
            RSA rsa = RSA.Create(2048);
            var privateKey = rsa.ExportRSAPrivateKey();
            var publicKey = rsa.ExportRSAPublicKey();
            return new Tuple<byte[], byte[]>(privateKey, publicKey);
        }
    }
}
