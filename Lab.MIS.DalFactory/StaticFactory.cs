using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Lab.MIS.IDAL;

namespace Lab.MIS.DalFactory
{
    public class StaticFactory
    {
        //从配置文件获取引用程序集的名称
        public static string AssemblyName = System.Configuration.ConfigurationManager.AppSettings["DalAssemblyName"].ToString();

        private static IUserInfoDal iUserInfoDal { get; set; }
        private static IPointPictureDal iPointPictureDal { get; set; }
        private static IDeviceInfoDal iDeviceInfoDal { get; set; }

        private static IMonitorPointInfoDal iMonitorPointInfoDal { get; set; }

        public static IUserInfoDal GetUserInfoDal()
        {
            iUserInfoDal = Assembly.Load(AssemblyName).CreateInstance(AssemblyName + ".UserInfoDal") as IUserInfoDal;

            return iUserInfoDal;
        }

        public static IPointPictureDal GetPointPictureDal()
        {
            iPointPictureDal = Assembly.Load(AssemblyName).CreateInstance(AssemblyName + ".PointPictureDal") as IPointPictureDal;
            return iPointPictureDal;
        }

        public static IDeviceInfoDal GetDeviceInfoDal()
        {
            iDeviceInfoDal = Assembly.Load(AssemblyName).CreateInstance(AssemblyName + ".DeviceInfoDal") as IDeviceInfoDal;
            return iDeviceInfoDal;
        }

        public static IMonitorPointInfoDal GetMonitorPointInfoDal()
        {
            iMonitorPointInfoDal = Assembly.Load(AssemblyName).CreateInstance(AssemblyName + ".MonitorPointInfoDal") as IMonitorPointInfoDal;
            return iMonitorPointInfoDal;
        }

    }
}
