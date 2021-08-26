using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MeCrypt.Common
{
    public static class EncryptionHelper
    {
        private const int IV_SIZE = 16; // size in bytes
        // the key must be 128, 192 or 256 bits long
        // for this implementation I will choose a 32-byte sized key
        public static byte[] EncryptText(byte[] key, string text)
        {
            if (key.Length != 32)
            {
                return null;
            }

            using (Aes aes = Aes.Create())
            {
                // adding the AES key to the class
                aes.Key = key;

                // generating an Initialization Vector and adding it to the class
                RNGCryptoServiceProvider provider = new RNGCryptoServiceProvider();
                byte[] iv = new byte[IV_SIZE];

                provider.GetBytes(iv);
                aes.IV = iv;

                // encrypting the string to an array of bytes
                byte[] encrypted = Aes_Encrypt(text, aes.Key, aes.IV);
                byte[] encryptedWithIV = new byte[IV_SIZE + encrypted.Length];

                // adding the IV to the encrypted text
                Array.Copy(iv, encryptedWithIV, IV_SIZE);
                Array.Copy(encrypted, 0, encryptedWithIV, IV_SIZE, encrypted.Length);

                return encryptedWithIV;
            }
        }

        public static string DecryptText(byte[] key, byte[] encryptedWithIV)
        {
            if (key.Length != 32)
            {
                return null;
            }

            using (Aes aes = Aes.Create())
            {
                // adding the AES key to the class
                aes.Key = key;

                // getting the IV from the encrypted message (first 16 bytes)
                byte[] iv = new byte[IV_SIZE];
                Array.Copy(encryptedWithIV, iv, IV_SIZE);

                aes.IV = iv;
                byte[] encryptedText = new byte[encryptedWithIV.Length - IV_SIZE];
                Array.Copy(encryptedWithIV, IV_SIZE, encryptedText, 0, encryptedText.Length);

                // decrypting the array of bites to a string
                var decryptedText = Aes_Decrypt(encryptedText, aes.Key, aes.IV);

                return decryptedText;
            }
        }

        private static byte[] Aes_Encrypt(string text, byte[] Key, byte[] IV)
        {
            byte[] encrypted;

            using (Aes aes = Aes.Create())
            {
                aes.Key = Key;
                aes.IV = IV;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter(cryptoStream))
                        {
                            streamWriter.Write(text);
                        }
                        encrypted = memoryStream.ToArray();
                    }
                }
            }

            return encrypted;
        }

        private static string Aes_Decrypt(byte[] encryptedText, byte[] Key, byte[] IV)
        {
            string decryptedText = null;

            using (Aes aes = Aes.Create())
            {
                aes.Key = Key;
                aes.IV = IV;

                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream(encryptedText))
                {
                    using (CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader streamReader = new StreamReader(cryptoStream))
                        {
                            decryptedText = streamReader.ReadToEnd();
                        }
                    }
                }
            }

            return decryptedText;
        }
    }
}
