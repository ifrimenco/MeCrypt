using AutoMapper;
using MeCrypt.DataAccess.EF.Entities;
using MeCrypt.DataObjects.DTOs;
using System;

namespace SocializR.BusinessLogic.Implementation.Account
{
    public class SecretsProfile : Profile
    {
        public SecretsProfile()
        {
            CreateMap<Secret, SecretListItemModel>();
        }
    }
}
