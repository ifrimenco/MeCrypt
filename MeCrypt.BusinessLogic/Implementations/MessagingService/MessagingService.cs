using MeCrypt.Common;
using MeCrypt.DataAccess.EF.Entities;
using MeCrypt.DataObjects.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Numerics;
using Microsoft.EntityFrameworkCore;

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
            var rooms = UnitOfWork.Rooms.Get()
                .Include(room => room.UserRooms)
                .ToList();

            var filteredRooms = rooms
                .Where(room => (room.UserRooms
                    .Select(ur => ur.UserId == CurrentUser.Id) != null));

            return filteredRooms.Select(room =>
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

        public void StoreMessages(StoreMessageModel model)
        {
            ExecuteInTransaction(uow =>
            {
                var messages = model.UserMessages.Select(um => new Message()
                {
                    RoomId = model.RoomId,
                    SenderId = CurrentUser.Id,
                    ReceiverId = um.Item1,
                    CryptedContent = um.Item2,
                    DateTimeSent = DateTimeOffset.Now,
                    Lifespan = 0
                });

                uow.Messages.InsertRange(messages);
                uow.SaveChanges();
            });
        }

        public IEnumerable<UserRoomListItemModel> GetUsersForRoom(Guid RoomId)
        {
            var users = UnitOfWork.Users.Get()
                .Include(user => user.UserRooms)
                .ToList();

            var filteredUsers = users
                .Where(user => (user.UserRooms
                    .Select(ur => ur.RoomId == CurrentUser.Id) != null));

            var currentUser = filteredUsers
                .FirstOrDefault(u => u.Id == CurrentUser.Id);

            if (currentUser == null)
            {
                return null;
            }

            return filteredUsers.Select(user =>
                Mapper.Map<User, UserRoomListItemModel>(user));
        }
    }
}