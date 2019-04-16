using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Lab.MIS.Model;

namespace Lab.MIS.BLL
{
    public class DeviceInfoService:BaseService<DeviceInfo>
    {
        public override void setCurrentDal()
        {
            CurrentDal = dbSession.GetDeviceInfoDal;
        }
    }
}
