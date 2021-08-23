using MeCrypt.Common;
using MeCrypt.DataAccess.EF.Entities;
using MeCrypt.DataObjects.DTOs;
using MeCrypt.DataObjects.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MeCrypt.BusinessLogic
{
    public class UserAccountService : BaseService
    {
        public UserAccountService(ServiceDependencies serviceDependencies)
            : base(serviceDependencies)
        {
        }

        public CurrentUserDto Login(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                return null;

            var user = UnitOfWork.Users.Get()
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                        .ThenInclude(r => r.RolePermissions)
                            .ThenInclude(rp => rp.Permission)
                .SingleOrDefault(user => user.Email == email);

            // check if username exists
            if (user == null)
                return null;

            // check if password is correct
            if (!HashHelper.VerifyPassword(password, user.PasswordHash))
            {
                return null;
            }

            // authentication successful
            return new CurrentUserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsAuthenticated = true,
                Email = user.Email,
                Permissions = user.UserRoles
                    .Select(ur => ur.Role)
                    .Select(r => r.RolePermissions)
                    .SelectMany(array => array
                        .Select(rp => rp.PermissionId))
                    .Distinct()
                    .ToList(),
            };
        }

        public User Register(RegisterDto model)
        {
            // TODO de facut cu validator
            var user = UnitOfWork.Users.Get().Where(u => u.Email == model.Email).FirstOrDefault();

            if (user != null) 
            {
                return user;
            }

            return ExecuteInTransaction(unitOfWork =>
            {
                var user = Mapper.Map<RegisterDto, User>(model);

                user.PasswordHash = HashHelper.HashPassword(user.PasswordHash);

                user.UserRoles = new List<UserRole>
                {
                    new UserRole
                    {
                    RoleId = (int) RoleTypes.User,
                    UserId = user.Id
                    }
                };

                unitOfWork.Users.Insert(user);
                unitOfWork.SaveChanges();

                user = unitOfWork.Users.Get()
                    .Include(u => u.UserRoles)
                        .ThenInclude(ur => ur.Role)
                    .SingleOrDefault(u => u.Id == user.Id);

                return user;
            });
        }
    }
}
