using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Lab.MIS.Model;

namespace Lab.MIS.BLL
{
    public class MonitorPointInfoService : BaseService<MonitorPointInfo>
    {
        public override void setCurrentDal()
        {
            CurrentDal = dbSession.GetMonitorPointInfoDal;
        }
     

    }
}
