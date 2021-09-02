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

        public SecretDetailsModel GetSecret(Guid secretId)
        {
            return UnitOfWork.Secrets.Get()
                .Where(s => s.Id == secretId)
                .Select(secret => Mapper.Map<Secret, SecretDetailsModel>(secret))
                .SingleOrDefault();
        }

        public string OpenSecret(OpenSecretModel model)
        {
            foreach (var share in model.Shares)
            {
                if (share == "" || share == null)
                {
                    return null;
                } 
            }

            var content = UnitOfWork.Secrets.Get().Where(secret => secret.Id == model.SecretId).SingleOrDefault()?.Content;

            if (content == null)
            {
                return null;
            }

            List<BigInteger> shares = model.Shares.Select(s => BigInteger.Parse(s)).ToList();

            var key = SecretsHelper.GenerateSecret(shares).ToByteArray();
            try
            {
                var decryptedContent = SymmetricEncryptionHelper.DecryptText(key, content);

                // dupa aceea secretul este sters. Totusi, din frica unei alte blocari a contului mail de catre Microsoft,
                // las implementarea acestei bucati pana dupa licenta pentru a putea demonstra functionalitatea componentei de partajare a secretelor
                return decryptedContent;
            }
            catch
            {
                return null;
            }

        }

        
        public void CreateSecret(CreateSecretModel model)
        {
            ExecuteInTransaction(unitOfWork =>
            {
                RNGCryptoServiceProvider provider = new RNGCryptoServiceProvider();

                var key = new byte[32];
                provider.GetBytes(key);

                var encryptedContent = SymmetricEncryptionHelper.EncryptText(key, model.Content);

                var secret = new Secret()
                {
                    Content = encryptedContent,
                    Title = model.Title,
                    Id = Guid.NewGuid(),
                    OpenerId = CurrentUser.Id,
                };

                unitOfWork.Secrets.Insert(secret);
                unitOfWork.SaveChanges();

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

                    mailHelper.SendSecretsMail(email, userShares, secret.Title);
                }
            });

        }
    }
}