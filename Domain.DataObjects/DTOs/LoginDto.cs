using System;
using System.Collections.Generic;

namespace MeCrypt.DataObjects.DTOs
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string PublicKey { get; set; }
    }
}
