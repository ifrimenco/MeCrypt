using MeCrypt.DataAccess.DataAccess.EF.Entities;
using MeCrypt.DataObjects.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MeCrypt.BusinessLogic
{
    public class UsersService : BaseService
    {
        public UsersService(ServiceDependencies serviceDependencies)
            : base(serviceDependencies)
        {
        }

        public IEnumerable<UserListItemModel> GetUsers()
        {
            return UnitOfWork.Users.Get().Select(user => 
                Mapper.Map<User, UserListItemModel>(user));
        }
    }
}