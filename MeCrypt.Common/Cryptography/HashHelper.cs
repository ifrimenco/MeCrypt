using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MeCrypt.Common
{
    public static class HashHelper
    {

        private const int SALT_SIZE = 24; // size in bytes
        private const int HASH_SIZE = 24; // size in bytes
        private const int ITERATIONS = 100000; // number of pbkdf2 iterations
        public static string HashPassword(string password)
        {

            RNGCryptoServiceProvider provider = new RNGCryptoServiceProvider();
            byte[] salt = new byte[SALT_SIZE];
            provider.GetBytes(salt);

            // Generate the hash
            Rfc2898DeriveBytes pbkdf2 = new Rfc2898DeriveBytes(password, salt, ITERATIONS);
            byte[] hash = pbkdf2.GetBytes(HASH_SIZE);

            byte[] hashBytes = new byte[SALT_SIZE + HASH_SIZE];
            Array.Copy(salt, 0, hashBytes, 0, SALT_SIZE);
            Array.Copy(hash, 0, hashBytes, SALT_SIZE, HASH_SIZE);

            string passwordHash = Convert.ToBase64String(hashBytes);
            return passwordHash;
        }

        public static bool VerifyPassword(string password, string storedPassword)
        {
            byte[] hashBytes = Convert.FromBase64String(storedPassword);
            // Get the salt 
            byte[] salt = new byte[SALT_SIZE];
            Array.Copy(hashBytes, 0, salt, 0, SALT_SIZE);
            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, ITERATIONS);
            byte[] hash = pbkdf2.GetBytes(HASH_SIZE);
            for (int i = 0; i < HASH_SIZE; i++)
            {
                if (hashBytes[i + SALT_SIZE] != hash[i])
                {
                    return false;
                }
            }
            return true;
        }
    }
}
