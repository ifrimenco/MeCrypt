﻿using System;
using System.Collections.Generic;

namespace MeCrypt.DataObjects.DTOs
{
    public class UserListItemModel
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}

