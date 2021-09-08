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

            var filteredRooms = new List<Room>();

            foreach (var room in rooms)
            {
                var ur = room.UserRooms
                    .Where(ur => ur.UserId == CurrentUser.Id);

                if (ur.Count() > 0)
                {
                    filteredRooms.Add(room);
                }
            }

            var f = rooms
                .Where(room => (room.UserRooms
                    .Where(ur => ur.UserId == CurrentUser.Id) != null));

            return filteredRooms.Select(room =>
                Mapper.Map<Room, RoomListItemModel>(room));
        }

        public IEnumerable<UserRoomListItemModel> GetUsersForRoom(Guid roomId)
        {
            var users = UnitOfWork.Users.Get()
                .Include(user => user.UserRooms)
                .ToList();

            var filteredUsers = new List<User>();

            foreach (var user in users)
            {
                var ur = user.UserRooms
                    .Where(ur => ur.RoomId == roomId);

                if (ur.Count() > 0)
                {
                    filteredUsers.Add(user);
                }
            }

            return filteredUsers.Select(user =>
                Mapper.Map<User, UserRoomListItemModel>(user));

            var currentUser = filteredUsers
                .FirstOrDefault(u => u.Id == CurrentUser.Id);

            if (currentUser == null)
            {
                return null;
            }

            return filteredUsers.Select(user =>
                Mapper.Map<User, UserRoomListItemModel>(user));
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
                    Id = Guid.NewGuid(),
                    RoomId = model.RoomId,
                    SenderId = CurrentUser.Id,
                    ReceiverId = um.Item1,
                    CryptedContent = um.Item2,
                    DateTimeSent = DateTimeOffset.Now,
                    Lifespan = 0
                });
                foreach (var message in messages)
                {
                    try
                    {
                        uow.Messages.Insert(message);
                        uow.SaveChanges();
                    }
                    catch (Exception e)
                    {

                    }
                }

            });
        }
        public IEnumerable<MessageListItemModel> GetMessagesForRoom(Guid roomId)
        {
            var messages = UnitOfWork.Messages.Get()
                .Where(message => message.RoomId == roomId && message.ReceiverId == CurrentUser.Id)
                .OrderBy(message => message.DateTimeSent)
                .Select(message => Mapper.Map<Message, MessageListItemModel>(message));

            return messages;
        }

        public void DeleteMessages()
        {
            ExecuteInTransaction(unitOfWork =>
            {
                var messages = UnitOfWork.Messages.Get()
                    .Where(message => message.ReceiverId == CurrentUser.Id);

                unitOfWork.Messages.DeleteRange(messages);
                unitOfWork.SaveChanges();
            });
        }
    }
}