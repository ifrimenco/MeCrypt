using AutoMapper;
using MeCrypt.DataAccess.EF.Entities;
using MeCrypt.DataObjects.DTOs;
using System;

namespace SocializR.BusinessLogic.Implementation.Account
{
    public class MessagingProfile : Profile
    {
        public MessagingProfile()
        {
            CreateMap<Room, RoomListItemModel>();
            CreateMap<User, UserRoomListItemModel>();
        }
    }
}
