using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Numerics;
using System.Threading.Tasks;

namespace MeCrypt.Common
{
    public class MailHelper
    {
        private SmtpClient client;
        public MailHelper()
        {
            client = new SmtpClient("smtp-mail.outlook.com");

            client.Port = 587;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;

            System.Net.NetworkCredential credential =
                new System.Net.NetworkCredential("mecrypt@outlook.com", "parola@1234");

            client.EnableSsl = true;
            client.Credentials = credential;

        }
        public void SendSecretsMail(string emailAddress, List<BigInteger> secrets, Guid secretId)
        {
            var secretsArray = secrets.ToArray();

            MailMessage message = new MailMessage("mecrypt@outlook.com", emailAddress);

            message.Subject = "Secret Shares Received";

            message.Body = $"<h2>Here are your {secrets.Count} secret shares for secret with id {secretId}:</h2>";
            
            for (int i = 0; i < secretsArray.Length; i++)
            {
                var secretText = $"<p>{i + 1}: {secretsArray[i].ToString()}</p>";
                message.Body += secretText;
            }

            message.IsBodyHtml = true;
            client.Send(message);
        }
    }
}