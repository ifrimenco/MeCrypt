using System;

namespace MeCrypt.DataAccess
{
    public class UnitOfWork // design pattern
    {
        private readonly MeCryptContext Context;

        public UnitOfWork(MeCryptContext context)
        {
            this.Context = context;
        }

        // aici vin IRepositories
        //private IRepository<User> users;
        //public IRepository<User> Users => users ?? (users = new BaseRepository<User>(Context));

        public void SaveChanges()
        {
            Context.SaveChanges();
        }
    }
}
