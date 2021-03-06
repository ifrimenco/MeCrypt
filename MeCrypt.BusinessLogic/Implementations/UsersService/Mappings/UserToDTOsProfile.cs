using AutoMapper;
using MeCrypt.DataAccess.EF.Entities;
using MeCrypt.DataObjects.DTOs;
using System;

namespace SocializR.BusinessLogic.Implementation.Account
{
    public class UserToDTOsssProfile : Profile
    {
        public UserToDTOsssProfile()
        {
            CreateMap<User, UserListItemModel>();
        }
    }
}
