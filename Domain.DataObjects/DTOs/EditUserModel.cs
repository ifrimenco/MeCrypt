using System;
using System.Collections.Generic;

namespace MeCrypt.DataObjects.DTOs
{
    public class EditUserModel
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public bool IsAdmin { get; set; }
        public bool IsDealer { get; set; }
    }
}

