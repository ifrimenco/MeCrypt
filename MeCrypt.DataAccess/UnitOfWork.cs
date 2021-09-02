using MeCrypt.Common;
using MeCrypt.DataAccess.EF;
using MeCrypt.DataAccess.EF.Entities;
using System;

namespace MeCrypt.DataAccess
{
    public class UnitOfWork 
    {
        private readonly MeCryptContext Context;

        public UnitOfWork(MeCryptContext context)
        {
            this.Context = context;
        }

        // aici vin IRepositories
        private IRepository<User> users; 
        public IRepository<User> Users => users ?? (users = new BaseRepository<User>(Context));

        private IRepository<Role> roles;
        public IRepository<Role> Roles => roles ?? (roles = new BaseRepository<Role>(Context));

        private IRepository<UserRole> userRoles;
        public IRepository<UserRole> UserRoles => userRoles ?? (userRoles = new BaseRepository<UserRole>(Context));

        private IRepository<Permission> permissions;
        public IRepository<Permission> Permissions => permissions ?? (permissions = new BaseRepository<Permission>(Context));

        private IRepository<RolePermission> rolePermissions;
        public IRepository<RolePermission> RolePermissions => rolePermissions ?? (rolePermissions = new BaseRepository<RolePermission>(Context));

        private IRepository<Message> messages;
        public IRepository<Message> Messages => messages ?? (messages = new BaseRepository<Message>(Context));

        private IRepository<Room> rooms;
        public IRepository<Room> Rooms => rooms ?? (rooms = new BaseRepository<Room>(Context));

        private IRepository<UserRoom> userRooms;
        public IRepository<UserRoom> UserRooms => userRooms ?? (userRooms = new BaseRepository<UserRoom>(Context));

        private IRepository<Secret> secrets;
        public IRepository<Secret> Secrets => secrets ?? (secrets = new BaseRepository<Secret>(Context));

        public void SaveChanges()
        {
            Context.SaveChanges();
        }
    }
}
