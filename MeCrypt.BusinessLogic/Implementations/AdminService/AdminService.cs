using MeCrypt.DataAccess.EF.Entities;
using MeCrypt.DataObjects.DTOs;
using MeCrypt.DataObjects.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MeCrypt.BusinessLogic
{
    public class AdminService : BaseService
    {
        public AdminService(ServiceDependencies serviceDependencies)
            : base(serviceDependencies)
        {
        }

        public IEnumerable<RoleListItemModel> GetRoles()
        {
            return UnitOfWork.Roles.Get().Select(role =>
                Mapper.Map<Role, RoleListItemModel>(role));
        }

        public EditUserModel GetUser(Guid id)
        {
            var user = UnitOfWork.Users.Get()
                .Include(u => u.UserRoles)
                .Where(user => user.Id == id)
                .SingleOrDefault();

            return Mapper.Map<User, EditUserModel>(user);
        }

        public EditUserModel EditUser(EditUserModel model)
        {
            var user = UnitOfWork.Users.Get()
                .Where(u => u.Id == model.Id)
                .SingleOrDefault();

            user.UserRoles = MapUserRoles(model);
            var userRoles = UnitOfWork.UserRoles.Get().Where(ur => ur.UserId == user.Id);

            UnitOfWork.UserRoles.DeleteRange(userRoles);
            UnitOfWork.SaveChanges();

            UnitOfWork.Users.Update(user);
            UnitOfWork.SaveChanges();

            return model;
        }

        private List<UserRole> MapUserRoles(EditUserModel source)
        {
            var userRoles = new List<UserRole>()
            {
                new UserRole
                {
                    UserId = source.Id,
                    RoleId = (int)RoleTypes.User,
                }
            };

            if (source.IsAdmin)
            {
                userRoles.Add(new UserRole
                {
                    UserId = source.Id,
                    RoleId = (int)RoleTypes.Admin
                });
            }

            if (source.IsDealer)
            {
                userRoles.Add(new UserRole
                {
                    UserId = source.Id,
                    RoleId = (int)RoleTypes.Dealer
                });
            }

            if (source.IsSecretViewer)
            {
                userRoles.Add(new UserRole
                {
                    UserId = source.Id,
                    RoleId = (int)RoleTypes.Secret_Viewer
                });
            }

            return userRoles;
        }
    }
}