using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading.Tasks;
using Lab.MIS.Model;

namespace Lab.MIS.EFDAL
{
    public class DbContextFactory
    {
        /// <summary>
        /// 获取线程内唯一dbcontext
        /// </summary>
        /// <returns></returns>
        static public DbContext GetCurrentDbContext()
        {

            DbContext dbContext = (DbContext)CallContext.GetData("dbContext");
            if (dbContext == null)
            {
                dbContext = new DataModelContainer();//Model中的实体模型的EF上下文实例
                CallContext.SetData("dbContext", dbContext);
            }
            return dbContext;
        }
    }
}
