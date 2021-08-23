using System;
using System.Collections.Generic;

namespace MeCrypt.DataObjects.DTOs
{
    public class CurrentUserDto
    {
        public CurrentUserDto()
        {
            Permissions = new List<int>();
        }

        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsAuthenticated { get; set; }

        public List<int> Permissions { get; set; }

    }
}
