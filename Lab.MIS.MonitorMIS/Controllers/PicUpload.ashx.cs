using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Lab.MIS.MonitorMIS.Controllers
{
    /// <summary>
    /// PicUpload 的摘要说明
    /// </summary>
    public class PicUpload : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            HttpPostedFile file = context.Request.Files["file_data"];
            //files[j].name.substring(files[j].name.lastIndexOf(".")).toLowerCase();
            string path = "/Resource/UpImages/" + Guid.NewGuid().ToString() + file.FileName.Substring(file.FileName.LastIndexOf("."));
            file.SaveAs(context.Request.MapPath(path));

            //string json = "{\"msg\":\"成功!\"}";
            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            sb.Append("\"msg\":\"" + path + "\"");
            sb.Append("}");
            context.Response.Write(sb.ToString());
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}