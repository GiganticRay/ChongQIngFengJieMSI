using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Lab.MIS.DalFactory;
using Lab.MIS.IDAL;

namespace Lab.MIS.BLL
{
    abstract public class BaseService<TModel> where TModel: class ,new()
    {
        public DbSession dbSession = new DbSession();

        public IBaseDal<TModel> CurrentDal;
        public BaseService()
        {
            setCurrentDal();
        }
        public abstract void setCurrentDal();

        #region 查询

        /// <summary>
        /// 获取UsersQueryable集合
        /// </summary>
        /// <returns>匹配的Lambda表达式</returns>
        public IQueryable<TModel> Get(Expression<Func<TModel, bool>> WhereLambda)
        {
            return CurrentDal.Get(WhereLambda);
        }

        #endregion

        #region 分页查询

        /// <summary>
        /// 分页查询
        /// </summary>
        /// <typeparam name="T">根据...排序的字段的Type</typeparam>
        /// <param name="PageSize">每页的容量</param>
        /// <param name="PageIndex">当前页码</param>
        /// <param name="Total">页的总量</param>
        /// <param name="WhereLambda">查询的Lambda条件</param>
        /// <param name="OrderByLambda">排序的Lambda条件</param>
        /// <param name="IsAsc">是否升序</param>
        /// <returns></returns>
        public IQueryable<TModel> GetPage<T>(int PageSize, int PageIndex, out int Total,
            Expression<Func<TModel, bool>> WhereLambda, Expression<Func<TModel, T>> OrderByLambda, bool IsAsc)
        {
            return CurrentDal.GetPage(PageSize, PageIndex, out Total, WhereLambda, OrderByLambda, IsAsc);
        }

        #endregion

        #region 增加

        /// <summary>
        /// BaseService的插入
        /// </summary>
        /// <param name="Enity">要插入的Enity实体</param>
        /// <returns>返回插入的Enity实体</returns>
        public TModel Add(TModel Enity)
        {
            TModel tmp = CurrentDal.Add(Enity);
            dbSession.SaveChanges();
            return Enity;
        }

        #endregion

        #region 删除

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="WhereLambda">删除条件的lambda的表达式</param>
        /// <returns>符合此lambda的集合</returns>
        public int Delete(Expression<Func<TModel, bool>> WhereLambda)
        {
            //DbContextEnity.SaveChanges();
            int Count = CurrentDal.Delete(WhereLambda);
            dbSession.SaveChanges();
            return Count;
        }


        #endregion

        #region 修改

        public bool Update(TModel Enity)
        {
            CurrentDal.Update(Enity);
            dbSession.SaveChanges();
            //return DbContextEnity.SaveChanges() > 0;
            return true;
        }

        #endregion
    }
}
