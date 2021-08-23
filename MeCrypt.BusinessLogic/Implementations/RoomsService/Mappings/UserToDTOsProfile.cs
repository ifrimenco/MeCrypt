using AutoMapper;
using MeCrypt.DataAccess.EF.Entities;
using MeCrypt.DataObjects.DTOs;
using System;

namespace SocializR.BusinessLogic.Implementation.Account
{
    public class UserToDTOssProfile : Profile
    {
        public UserToDTOssProfile()
        {
            CreateMap<User, UserListItemModel>();
        }
    }
}
