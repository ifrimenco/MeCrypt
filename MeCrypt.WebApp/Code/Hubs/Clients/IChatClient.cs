using System.Threading.Tasks;
using MeCrypt.DataAccess.EF.Entities;

namespace MeCrypt.WebApp.Code
{
    public interface IChatClient
    {
        Task ReceiveMessage(MessageReceived messageReceived);
        Task TestSubscription(string message);
        Task TriggerAddUser(UserMsg userMsg);
    }
}