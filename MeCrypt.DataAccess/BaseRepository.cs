using MeCrypt.Common;
using MeCrypt.DataAccess.EF;
using System.Collections.Generic;
using System.Linq;

namespace MeCrypt.DataAccess
{
    public class BaseRepository<TEntity> : IRepository<TEntity>
        where TEntity : class, IEntity
    {
        private readonly MeCryptContext Context;

        public BaseRepository(MeCryptContext context)
        {
            this.Context = context;
        }

        public IQueryable<TEntity> Get()
        {
            return Context.Set<TEntity>().AsQueryable();
        }

        public TEntity Insert(TEntity entity)
        {
            Context.Set<TEntity>().Add(entity);
            return entity;
        }

        public TEntity Update(TEntity entitty)
        {
            Context.Set<TEntity>().Update(entitty);

            return entitty;
        }

        public void Delete(TEntity entity)
        {
            Context.Set<TEntity>().Remove(entity);
        }

        public void DeleteRange(IEnumerable<TEntity> entities)
        {
            Context.Set<TEntity>().RemoveRange(entities);
        }
    }
}
