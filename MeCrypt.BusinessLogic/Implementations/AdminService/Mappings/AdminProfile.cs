using AutoMapper;
using MeCrypt.DataAccess.EF.Entities;
using MeCrypt.DataObjects.DTOs;
using MeCrypt.DataObjects.Enums;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SocializR.BusinessLogic.Implementation.Account
{
    public class AdminProfile : Profile
    {
        public AdminProfile()
        {
            CreateMap<Role, RoleListItemModel>();
            CreateMap<User, EditUserModel>()
                .ForMember(u => u.IsAdmin, m => m.MapFrom(s => s.UserRoles
                    .Select(ur => ur.RoleId)
                    .ToList()
                    .Contains((int)RoleTypes.Admin)))
                .ForMember(u => u.IsDealer, m => m.MapFrom(s => s.UserRoles
                    .Select(ur => ur.RoleId)
                    .ToList()
                    .Contains((int)RoleTypes.Dealer)))
                .ForMember(u => u.IsSecretViewer, m => m.MapFrom(s => s.UserRoles
                    .Select(ur => ur.RoleId)
                    .ToList()
                    .Contains((int)RoleTypes.Secret_Viewer)));
        }
    }
}
