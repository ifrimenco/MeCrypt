
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MeCrypt.DataAccess.EF.Entities;
using MeCrypt.DataObjects.DTOs;
using Microsoft.AspNetCore.SignalR;

namespace MeCrypt.WebApp.Code
{
    public class MessageReceived
    {
        public string SenderId { get; set; }
        public string SenderName { get; set; }
        public string RoomId { get; set; }
        public string Message { get; set; }
    }

    public class KeyValue
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }

    public class UserMsg
    {
        public string Id { get; set; }
        public string PublicKey { get; set; }
    }

    public class Cache
    {
        private Dictionary<string, List<string>> dictionary = new Dictionary<string, List<string>>();
        public void StoreKeyValue(string key, string value)
        {
            if (dictionary.ContainsKey(key))
            {
                dictionary[key].Add(value);
            }
            else
            {
                dictionary.Add(key, new List<string>() { value });
            }
        }

        public List<string> GetValues(string key)
        {
            if (dictionary.ContainsKey(key))
            {
                return dictionary[key];
            }

            return null;
        }

        public void TryClear(string key)
        {
            if (dictionary.ContainsKey(key) && dictionary[key].Count > 100)
            {
                dictionary[key].Clear();
            }
        }
    }

    public class ChatHub : Hub<IChatClient>
    {
        private readonly static Cache cache = new Cache();
        public async Task Subscribe(string userId, List<string> users, string roomId, string publicKey)
        {
            var room = Context.GetHttpContext().Request.Query["roomId"];

            var user = Context.User.Identity.Name;
            var key = userId + roomId;

            cache.TryClear(key);
           
            cache.StoreKeyValue(key, Context.ConnectionId);
            

            var usersArray = users.ToArray();
            var keyValue = new KeyValue()
            {
                Key = key,
                Value = Context.ConnectionId
            };

            for (int i = 0; i < usersArray.Length; i++)
            {
                var receiverId = usersArray[i];
                var connectionsForUserRoom = cache.GetValues(receiverId + roomId);

                if (connectionsForUserRoom != null)
                {
                    foreach (var connection in connectionsForUserRoom)
                    {
                        await Clients.Client(connection).TriggerAddUser(new UserMsg
                        {
                            Id = userId,
                            PublicKey = publicKey
                        });
                    }
                }
            }

            await Clients.Client(Context.ConnectionId).TestSubscription(key);
        }
        public Task AddUser(KeyValue keyValue)
        {
            cache.StoreKeyValue(keyValue.Key, keyValue.Value);

            return Task.FromResult(0);
        }

        public async Task SendMessage(List<string> users, List<string> messages, string roomId, string senderId, string senderName)
        {
            var messagesArray = messages.ToArray();
            var usersArray = users.ToArray();
            for (int i = 0; i < messagesArray.Length; i++)
            {
                var receiverId = usersArray[i];
                var message = messagesArray[i];
                var connectionsForUserRoom = cache.GetValues(receiverId + roomId);

                if (connectionsForUserRoom != null)
                {
                    foreach (var connection in connectionsForUserRoom)
                    {
                        var messageReceived = new MessageReceived()
                        {
                            SenderId = senderId,
                            SenderName = senderName,
                            Message = message,
                            RoomId = roomId
                        };
                        await Clients.Client(connection).ReceiveMessage(messageReceived);
                    }
                }
            }
        }
    }
}
