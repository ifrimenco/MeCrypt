
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

    public static class Cache
    {
        private static Dictionary<string, List<string>> dictionary = new Dictionary<string, List<string>>();
        public static void StoreKeyValue(string key, string value)
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

        public static List<string> GetValues(string key)
        {
            if (dictionary.ContainsKey(key))
            {
                return dictionary[key];
            }

            return null;
        }

        public static void TryClear(string key)
        {

            if (dictionary.ContainsKey(key) && Cache.dictionary[key].Count > 100)
            {
                dictionary[key].Clear();
            }
        }
    }

    public class ChatHub : Hub<IChatClient>
    {

        public async Task Subscribe(string userId, string roomId)
        {
            var key = userId + roomId;

            Cache.TryClear(key);

            Cache.StoreKeyValue(key, Context.ConnectionId);

            await Clients.Client(Context.ConnectionId).TestSubscription(key);
        }

        public async Task SendMessage(List<string> users, List<string> messages, string roomId, string senderId, string senderName)
        {
            var messagesArray = messages.ToArray();
            var usersArray = users.ToArray();
            for (int i = 0; i < messagesArray.Length; i++)
            {
                var receiverId = usersArray[i];
                var message = messagesArray[i];
                var connectionsForUserRoom = Cache.GetValues(receiverId + roomId);

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
