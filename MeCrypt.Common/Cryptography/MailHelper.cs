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
        private string email = "mecrypt@outlook.com";
        private string password = "parola@1234";
        private SmtpClient client;
        public MailHelper()
        {
            client = new SmtpClient("smtp-mail.outlook.com");

            client.Port = 587;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;

            System.Net.NetworkCredential credential =
                new System.Net.NetworkCredential(email, password);

            client.EnableSsl = true;
            client.Credentials = credential;

        }

        public void SendSecretsNotification(string emailAddress, int nrShares, string secretTitle, Guid secretId)
        {
            MailMessage message = new MailMessage("mecrypt@outlook.com", emailAddress);


            message.Subject = "Secret Created";

            message.Body = $"<h2> The Secret titled {secretTitle} has been created on the MeCrypt Application";
            message.Body += $"<p>Please keep in mind that this secret needs at least ${nrShares} for it to be opened properly</p>";
        }
        public void SendSecretsMail(string emailAddress, List<BigInteger> shares, string secretTitle)
        {
            var sharesArray = shares.ToArray();

            MailMessage message = new MailMessage("mecrypt@outlook.com", emailAddress);

            message.Subject = "Secret Shares Received";

            message.Body = $"<h2>Here are your {shares.Count} secret shares for the secret titled {secretTitle}:</h2>";
            
            for (int i = 0; i < sharesArray.Length; i++)
            {
                var secretText = $"<p>{i + 1}: {sharesArray[i].ToString()}</p>";
                message.Body += secretText;
            }

            message.IsBodyHtml = true;
            client.Send(message);
        }
    }
}