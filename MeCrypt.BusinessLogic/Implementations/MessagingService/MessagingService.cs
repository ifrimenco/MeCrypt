using MeCrypt.Common;
using MeCrypt.DataAccess.EF.Entities;
using MeCrypt.DataObjects.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Numerics;

namespace MeCrypt.BusinessLogic
{
    public class MessagingService : BaseService
    {
        public MessagingService(ServiceDependencies serviceDependencies)
            : base(serviceDependencies)
        {
        }

        public IEnumerable<RoomListItemModel> GetRooms()
        {
            return UnitOfWork.Rooms.Get()
                .Select(room =>
                    Mapper.Map<Room, RoomListItemModel>(room));
        }

        public void CreateRoom(CreateRoomModel model)
        {
            ExecuteInTransaction(uow =>
            {
                var room = new Room()
                {
                    CreatorId = CurrentUser.Id,
                    Id = Guid.NewGuid(),
                    MessageLifespan = 0, // de implementat
                    Name = model.Name
                };

                uow.Rooms.Insert(room);
                uow.SaveChanges();

                var userRooms = model.Users.Select(userId => new UserRoom
                {
                    UserId = userId,
                    RoomId = room.Id
                });

                uow.UserRooms.InsertRange(userRooms);
                uow.SaveChanges();
            });
        }
    }
}