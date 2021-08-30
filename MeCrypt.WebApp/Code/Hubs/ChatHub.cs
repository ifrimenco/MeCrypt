
using System.Threading.Tasks;
using MeCrypt.DataAccess.EF.Entities;
using Microsoft.AspNetCore.SignalR;

namespace MeCrypt.WebApp.Code
{
    public class ChatHub : Hub<IChatClient>
    {
        public async Task SendMessage(Message message)
        {
            await Clients.All.ReceiveMessage(message);
        }
    }
}