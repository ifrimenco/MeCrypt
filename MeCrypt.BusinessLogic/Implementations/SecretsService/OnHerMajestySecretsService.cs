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
    public class OnHerMajestySecretsService : BaseService
    {
        private MailHelper mailHelper;
        public OnHerMajestySecretsService(ServiceDependencies serviceDependencies)
            : base(serviceDependencies)
        {
            mailHelper = new MailHelper();
        }

        public IEnumerable<SecretListItemModel> GetSecrets()
        {
            return UnitOfWork.Secrets.Get()
                .Where(s => s.OpenerId == CurrentUser.Id)
                .Select(secret =>
                    Mapper.Map<Secret, SecretListItemModel>(secret));
        }

        public string DecryptSecret(GetSecretModel model)
        {
            var content = UnitOfWork.Secrets.Get().Where(secret => secret.Id == model.secretId).SingleOrDefault()?.Content;

            if (content == null)
            {
                return null;
            }

            var key = SecretsHelper.GenerateSecret(model.Shares).ToByteArray();

            var decryptedContent = EncryptionHelper.DecryptText(key, content);

            if (decryptedContent == null)
            {
                return null;
            }

            return decryptedContent;
        }

        // TODO de facut toate metodele care sunt apelate de metode POST cu ExecuteInTransaction
        public void CreateSecret(CreateSecretModel model)
        {
            RNGCryptoServiceProvider provider = new RNGCryptoServiceProvider();

            var key = new byte[32];
            provider.GetBytes(key);

            var encryptedContent = EncryptionHelper.EncryptText(key, model.Content);

            var secret = new Secret()
            {
                Content = encryptedContent,
                Title = model.Title,
                Id = Guid.NewGuid(),
                OpenerId = CurrentUser.Id,
            };

            UnitOfWork.Secrets.Insert(secret);
            UnitOfWork.SaveChanges();

            var users = UnitOfWork.Users.Get().ToList();

            var keyAsInteger = new BigInteger(key);

            var nrShares = model.UserSecrets.Sum(us => us.Item2);
            var shares = SecretsHelper.GenerateShares(keyAsInteger, nrShares, model.MinimumShares).ToArray(); // de adaugat minimumShares pe front

            int currentShareIndex = 0;
            foreach (var userSecret in model.UserSecrets)
            {
                var email = users.Where(u => u.Id == userSecret.Item1).Select(u => u.Email).SingleOrDefault();

                if (email == null)
                {
                    return;
                }

                var userShares = new List<BigInteger>();
                for (int i = 0; i < userSecret.Item2; i++)
                {
                    userShares.Add(shares[currentShareIndex++]);
                }

                mailHelper.SendSecretsMail(email, userShares, secret.Id);
            }

        }
    }
}