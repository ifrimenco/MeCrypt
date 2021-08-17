﻿using System;
using System.Linq;

namespace MeCrypt.Common
{
    public interface IRepository<TEntity>
         where TEntity : class, IEntity
    {
        IQueryable<TEntity> Get();
        TEntity Insert(TEntity entity);
        TEntity Update(TEntity entitty);
        void Delete(TEntity entity);
    }
}
