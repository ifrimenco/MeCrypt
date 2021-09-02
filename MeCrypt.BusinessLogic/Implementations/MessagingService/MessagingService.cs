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
    public class MessagingService : BaseService
    {
        public MessagingService(ServiceDependencies serviceDependencies)
            : base(serviceDependencies)
        {
        }

        public IEnumerable<SecretListItemModel> GetSecrets()
        {
            return UnitOfWork.Secrets.Get()
                .Where(s => s.OpenerId == CurrentUser.Id)
                .Select(secret =>
                    Mapper.Map<Secret, SecretListItemModel>(secret));
        }
    }
}