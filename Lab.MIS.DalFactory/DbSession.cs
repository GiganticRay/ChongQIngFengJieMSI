using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Lab.MIS.EFDAL;
using Lab.MIS.IDAL;

namespace Lab.MIS.DalFactory
{
    public class DbSession
    {
        public IUserInfoDal GetUserInfoDal
        {
            get { return StaticFactory.GetUserInfoDal(); }
        }

        public IPointPictureDal GetPointPictureDal
        {
            get { return StaticFactory.GetPointPictureDal(); }
        }

        public IDeviceInfoDal GetDeviceInfoDal
        {
            get { return StaticFactory.GetDeviceInfoDal(); }
        }

        public IMonitorPointInfoDal GetMonitorPointInfoDal
        {
            get { return StaticFactory.GetMonitorPointInfoDal(); }
        }

        public int SaveChanges()
        {
            return DbContextFactory.GetCurrentDbContext().SaveChanges();
        }


    }
}
