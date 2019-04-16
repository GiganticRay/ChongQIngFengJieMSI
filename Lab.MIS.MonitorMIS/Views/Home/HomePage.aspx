<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<%@ Import Namespace="System.Data" %>
<!DOCTYPE html>
<html>
<head >
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="keywords" content="天地图" />
    <title>重庆市奉节县地质灾害监测预警系统</title>
    <script type="text/javascript" src="http://api.tianditu.com/api?v=4.0"></script>
    <%--css--%>
    <link href="../../Resource/Scripts/bootstrap-3.3.7-dist/css/bootstrap.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/sweetalert/sweetalert.css" rel="stylesheet" />
    <link href="../../Resource/bootstrap-datetimepicker-master/css/bootstrap-datetimepicker.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/LogIn/login-register.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/MyCss.css" rel="stylesheet" />
    <link href="../../Resource/Scripts/fileinput/fileinput.css" rel="stylesheet" />
    <%--js--%>
    <script src="../../Resource/Scripts/jquery-3.2.1.js"></script>
    <script src="../../Resource/Scripts/jquery-ui.min.js"></script>
    <script src="../../Resource/Scripts/bootstrap-3.3.7-dist/js/bootstrap.js"></script>
    <script src="../../Resource/Scripts/bootstrap-treeview.js"></script>
    <script src="../../Resource/Scripts/sweetalert/sweetalert-dev.min.js"></script>
    <script src="../../Resource/bootstrap-datetimepicker-master/js/bootstrap-datetimepicker.js"></script>

    <script src="../../Resource/Scripts/fileinput/fileinput.js"></script>
    <script src="../../Resource/Scripts/fileinput/fileinput_locale_zh.js"></script>
    <script src="../../Resource/Scripts/MyJs.js"></script>

</head>

<body>
    <div id="MainDiv">

        <div id="headDiv">
            <img src="../../Resource/Img/Logo.png" id="LogoImg" />
            <nav class="menu">
                <!-- 创建主按钮 -->
                <input type="checkbox" href="#" class="menu-open" name="menu-open" id="menu-open" />
                <label class="menu-open-button" for="menu-open">
                    <!-- 三根白线 -->
                    <span class="hamburger hamburger-1"></span>
                    <span class="hamburger hamburger-2"></span>
                    <span class="hamburger hamburger-3"></span>
                </label>


                <div class="menu-item" id="clearOverLays">
                    <span <%--class="glyphicon glyphicon-search"--%> aria-hidden="true">清空</span>
                </div>


                <div class="menu-item dropdown">
                    <span class="<%--glyphicon glyphicon-plus--%> dropdown-toggle" data-toggle="dropdown" aria-hidden="true">录入</span>
                    <ul class="dropdown-menu">
                        <li class="ToolBox" id="EnteringDeviceInfo"><span>录入监测设备信息</span></li>
                        <li role="separator" class="divider"></li>
                        <li class="ToolBox" id="EnteringMonitorInfo"><span>录入监测阵信息</span></li>
                    </ul>
                </div>


                <div class="menu-item dropdown">
                    <span class="<%--glyphicon glyphicon-wrench--%> dropdown-toggle" data-toggle="dropdown" aria-hidden="true">工具</span>
                    <ul class="dropdown-menu pull-right">
                        <li class="ToolBox" id="MeasureLength"><span>测量</span></li>
                        <li role="separator" class="divider"></li>
                        <li class="ToolBox" id="MeasureArea"><span>测面</span></li>
                        <li role="separator" class="divider"></li>
                        <li class="ToolBox" id="MeasurearkPoint"><span>标点</span></li>
                        <li role="separator" class="divider"></li>
                        <li class="ToolBox" id="MarkLine"><span>标线</span></li>
                        <li role="separator" class="divider"></li>
                        <li class="ToolBox" id="MarkArea"><span>标面</span></li>
                    </ul>
                </div>

                <div class="menu-item" id="mine"><span <%--class="glyphicon glyphicon-user"--%> aria-hidden="true">登录</span> </div>

                <div class="menu-item" id="showDevice"><span>显示</span></div>
                <div class="menu-item" id="showAllDevice"><span>详细</span></div>
            </nav>
            <%--模糊查询content--%>
            <div id="SearchDiv">
                <div id="SearchContent">
                    <input type="text" id="SearchText" />
                </div>
                <div id="search_btn"></div>
                <div id="SearchResultContent">
                    <table class="table" id="VagueTable">
                        <tbody id="TableBody">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="mapDiv"></div>
        <div id="side_bar">
            <div id="handlerDiv"></div>
            <span id="side_barController"></span>
            <p id="ChangeSearchParameters">修改查询参数</p>
            <table id="SearchMainTable" class="table">
                <caption>查询</caption>
                <tbody>
                    <tr>
                        <td colspan="2">
                            <h4>预警起始时间：</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="date" class="form-control" id="beforeTimeDate" value="2017-12-01" />
                        </td>
                        <td>
                            <input type="time" class="form-control" step="3" id="beforeTimeHMS" value="01:01:01" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <h4>预警结束时间：</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="date" class="form-control" id="endTimeDate" value="2017-12-04" />
                        </td>
                        <td>
                            <input type="time" class="form-control" step="3" id="endTimeHMS" value="01:01:01" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>请选择监测阵列：</h4>
                        </td>
                        <td>
                            <select class="btn btn-lg btn-default" id="searchSelect">
                                <option>全选</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>请选择监测类型：</h4>
                        </td>
                        <td>
                            <select class="btn btn-lg btn-default" id="searchSelectType">
                                <option value="0">全选</option>
                                <option value="1">滑坡</option>
                                <option value="2">泥石流</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: center;">
                            <button class="btn btn-lg btn-default" id="selectConfirmBtn">确定</button>
                            <button class="btn btn-lg btn-default" id="selectResetBtn">重置</button>
                            <button class="btn btn-lg btn-default" id="RemoveWarningPointBtn">隐藏预警点</button>
                        </td>
                    </tr>

                </tbody>
            </table>
            <div id="SearchDiseaseInfoDiv">
                <img src="../../Resource/Img/searching.gif" id="LoadingGif" />

                <table class="table table-bordered" id="SearchDiseaseInfoTable">
                    <caption>监测预警查询结果</caption>
                    <thead>
                        <tr>
                            <th>监测阵列</th>
                            <th>阵经度</th>
                            <th>阵纬度</th>
                            <th>经度</th>
                            <th>纬度</th>
                            <th>预警方位</th>
                            <th>监测类型</th>
                            <th>预警等级</th>
                            <th>预警时间</th>
                            <th>预留</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
        <div id="LayerToImg">
            <div id="layertoimg">
                <%--   <span>图层</span>--%>
            </div>
        </div>
         <div id="LayerToTer">
            <div id="layertoter">
                <%--   <span>图层</span>--%>
            </div>
        </div>
        <div id="LayerToOri">
            <div id="layertoori">
                <%--   <span>图层</span>--%>
            </div>
        </div>
    </div>


    <%--登录框--%>
    <div class="modal fade login" id="loginModal">
        <div class="modal-dialog login animated">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        &times;</button>
                    <h4 class="modal-title  logIn">登录</h4>
                </div>
                <div class="modal-body">
                    <div class="box">
                        <div class="content">
                            <div class="social">
                                <img src="../../Resource/Img/head.jpg" class="myimg-responsive" align="middle" alt="Responsive image">
                            </div>
                            <div class="error">
                            </div>
                            <div class="form loginBox">

                                <form method="post" accept-charset="UTF-8" id="loginForm">
                                    <input id="UserIdText" class="form-control" type="text" placeholder="用户名" name="UserName">
                                    <input id="UserPwdText" class="form-control" type="password" placeholder="密码" name="UserPwd">
                                    <input class="btn btn-default btn-login" type="button" id="btnLogin" value="登录">
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <%--点击标记显示监测设备--%>
    <div class="modal fade " id="DeviceInfoModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <%--  <div class="panel panel-info">--%>
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        &times;
                    </button>
                    <h4 class="modal-title H1">监测设备信息
                    </h4>
                </div>
                <div class="modal-body">
                    <ul class="nav nav-tabs">
                        <li class="active"><a href="#BaseMarkerInfoWin" data-toggle="tab">基本信息</a>
                        </li>
                        <li><a href="#picMarkerWindows" data-toggle="tab">图片</a></li>
                    </ul>
                    <form id="DeviceInfoForm">
                        <div class="tab-content">
                            <div id="BaseMarkerInfoWin" class="tab-pane fade in active ">
                                <table class="table table-striped table-bordered table-hover">
                                    <tr>
                                        <td>监测类型:</td>
                                        <td>
                                            <select name="MonitorType">
                                                <option value="滑坡">滑坡</option>
                                                <option value="泥石流">泥石流</option>
                                            </select></td>
                                    </tr>
                                    <tr>
                                        <td>监测点名称:</td>
                                        <td>
                                            <input type="text" name="DeviceName" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td>数采编号:</td>
                                        <td>
                                            <input type="text" name="ShuCaiNum" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td>传感器编号:</td>
                                        <td>
                                            <input type="text" name="SensorNum" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td>手机卡号:</td>
                                        <td>
                                            <input type="text" name="PhoneNum" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td>钥匙:</td>
                                        <td>
                                            <input type="text" name="YaoshiNum" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td>位置(经度):</td>
                                        <td>
                                            <input type="text" name="DeviceLon" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td>位置(纬度):</td>
                                        <td>
                                            <input type="text" name="DeviceLat" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td>备注:</td>
                                        <td>
                                            <input type="text" name="Beizhu" value="" /></td>
                                    </tr>
                                </table>
                                <input type="hidden" name="Id" id="hiddenDeviceID" value="" />
                                <input type="hidden" name="MonitorName" value="" />
                                <input type="hidden" name="MonitorPointInfoId" value="" />
                                <input type="hidden" name="PointPicture" value="" />
                                <!--用来清空表单数据-->
                                <input type="reset" name="reset" style="display: none;" />
                            </div>

                            <div id="picMarkerWindows" class="tab-pane fade ">
                                <div id="MarkerImgOutDivPic" class="carousel slide" data-ride="carousel">
                                    <ol class="carousel-indicators" id="MarkerOLPic">
                                        <li id="MarkerLiPic" data-target="#MarkerImgOutDivPic" data-slide-to="0" class="active"></li>
                                    </ol>
                                    <div class="carousel-inner" role="listbox" id="MarkerImgDivPic">
                                        <div id="MarkerImgNearDivPic" class="item active">
                                            <img id="MarkerDefaultImgPic" class="d-block w-100" width="600px" height="200px" src="../../Resource/Img/DefaultImg.jpg"
                                                alt="First slide" name="defaultImg" />
                                        </div>
                                    </div>
                                    <a class="left carousel-control" href="#MarkerImgOutDivPic" role="button" data-slide="prev">
                                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="sr-only">Previous</span> </a>
                                    <a class="right carousel-control" href="#MarkerImgOutDivPic" role="button" data-slide="next">
                                        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span> </a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success glyphicon glyphicon-ok-circle" id="SaveDeviceInfo">
                        保存
                    </button>
                    <button type="button" class="btn btn-danger glyphicon glyphicon-remove-circle" id="DeleteDeviceInfo">
                        删除
                    </button>
                    <button type="button" class="btn btn-primary glyphicon glyphicon-off" data-dismiss="modal" id="CloseDeviceInfo">
                        关闭
                    </button>
                </div>
                <%--</div>--%>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal -->
        </div>
    </div>


    <%--预警点显示信息框--%>
    <div class="modal fade " id="DiseaseInfoModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <%--  <div class="panel panel-info">--%>
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        &times;
                    </button>
                    <h4 class="modal-title H1">预警点信息
                    </h4>
                </div>
                <div class="modal-body">
                    <form id="DiseaseInfoForm">
                        <table class="table table-striped table-bordered table-hover">
                            <tr>
                                <td>监测阵列:</td>
                                <td>
                                    <input type="text" id="MonitorName" readonly="readonly" value="" /></td>
                                <td>阵经度:</td>
                                <td>
                                    <input type="text" id="MonitorLon" readonly="readonly" value="" /></td>
                            </tr>
                            <tr>
                                <td>阵纬度:</td>
                                <td>
                                    <input type="text" id="MonitorLat" readonly="readonly" value="" /></td>
                                <td>经度:</td>
                                <td>
                                    <input type="text" id="Lon" readonly="readonly" value="" /></td>
                            </tr>
                            <tr>
                                <td>纬度:</td>
                                <td>
                                    <input type="text" id="Lat" readonly="readonly" value="" /></td>
                                <td>预警方位</td>
                                <td>
                                    <input type="text" id="WarningDirection" readonly="readonly" value="" /></td>
                            </tr>
                            <tr>
                                <td>监测类型</td>
                                <td>
                                    <input type="text" id="DiseaseMonitorType" readonly="readonly" value="" /></td>
                                <td>预警等级</td>
                                <td>
                                    <input type="text" id="WarningLevel" readonly="readonly" value="" /></td>
                            </tr>
                            <tr>
                                <td>预警时间</td>
                                <td>
                                    <input type="text" id="WarningTime" readonly="readonly" value="" /></td>
                            </tr>
                        </table>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary glyphicon glyphicon-off" data-dismiss="modal">
                        关闭
                    </button>
                </div>
                <%--</div>--%>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal -->
        </div>
    </div>

    <%--录入监测阵列--%>
    <div class="modal fade " id="MonitorInfoModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <%--  <div class="panel panel-info">--%>
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        &times;
                    </button>
                    <h4 class="modal-title H1">录入监测阵信息
                    </h4>
                </div>
                <div class="modal-body">
                    <form id="MonitorInfoForm">
                        <table class="table table-striped table-bordered table-hover">
                            <tr>
                                <td>监测阵列Id:</td>
                                <td>
                                    <input type="text" name="MonitorId" value="" /></td>
                            </tr>
                            <tr>
                                <td>监测阵列名称:</td>
                                <td>
                                    <input type="text" name="MonitorIdName" value="" /></td>
                            </tr>
                            <tr>
                                <td>监测类型:</td>
                                <td>
                                    <select name="MonitorType">
                                        <option value="滑坡">滑坡</option>
                                        <option value="泥石流">泥石流</option>
                                    </select></td>
                            </tr>
                        </table>

                        <!--用来清空表单数据-->
                        <input type="reset" name="reset" id="resetInMonitorInfoForm" style="display: none;" />
                    </form>
                </div>
                <div class="modal-footer">

                    <button type="button" class="btn btn-danger glyphicon glyphicon-remove-circle" id="EnteringMonitorInfoBtn">
                        录入
                    </button>
                    <button type="button" class="btn btn-primary glyphicon glyphicon-off" data-dismiss="modal" id="CloseMonitorInfo">
                        关闭
                    </button>
                </div>
                <%--</div>--%>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal -->
        </div>
    </div>


    <%--录入监测设备信息--%>
    <div class="modal fade " id="EnteringDeviceInfoModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <%--  <div class="panel panel-info">--%>
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        &times;
                    </button>
                    <h4 class="modal-title H1">监测设备信息
                    </h4>
                </div>
                <div class="modal-body">
                    <ul id="myTab" class="nav nav-tabs">
                        <li class="active"><a href="#BaseInfoWin" data-toggle="tab">基本信息</a>
                        </li>
                        <li><a href="#picWindows" data-toggle="tab">图片</a></li>
                    </ul>
                    <form id="EnteringDeviceInfoForm">
                        <div class="tab-content">
                            <div id="BaseInfoWin" class="tab-pane fade in active ">
                                <table class="table table-striped table-bordered table-hover">
                                    <tr>
                                        <td>所属监测阵:</td>
                                        <td>
                                            <select name="MonitorName" id="DeviceSelect">
                                            </select></td>
                                    </tr>
                                    <tr>
                                        <td>监测类型:</td>
                                        <td id="MonitorType">暂无</td>
                                    </tr>
                                    <tr>
                                        <td>监测点名称:</td>
                                        <td>
                                            <input type="text" name="DeviceName" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td>数采编号:</td>
                                        <td>
                                            <input type="text" name="ShuCaiNum" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td>传感器编号:</td>
                                        <td>
                                            <input type="text" name="SensorNum" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td>手机卡号:</td>
                                        <td>
                                            <input type="text" name="PhoneNum" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td>钥匙:</td>
                                        <td>
                                            <input type="text" name="YaoshiNum" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td>位置(经度):</td>
                                        <td>
                                            <input type="text" name="DeviceLon" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td>位置(纬度):</td>
                                        <td>
                                            <input type="text" name="DeviceLat" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td>备注:</td>
                                        <td>
                                            <input type="text" name="Beizhu" value="" /></td>
                                    </tr>
                                </table>
                                <%--对应的监测阵id   MonitorPointInfoId--%>
                                <input type="hidden" name="MonitorPointInfoId" id="MonitorPointInfoId" value="" />
                                <%--用来存放图片路径--%>
                                <input type="hidden" name="PicPathCollection" id="loadinImgPaths" value="" />
                                <!--用来清空表单数据-->
                                <input type="reset" name="reset" style="display: none;" />
                            </div>
                            <div id="picWindows" class="tab-pane fade ">
                                <div id="MarkerImgOutDiv" class="carousel slide" data-ride="carousel">
                                    <ol class="carousel-indicators" id="MarkerOL">
                                        <li id="MarkerLi" data-target="#MarkerImgOutDiv" data-slide-to="0" class="active"></li>
                                    </ol>
                                    <div class="carousel-inner" role="listbox" id="MarkerImgDiv">
                                        <div id="MarkerImgNearDiv" class="item active">
                                            <img id="MarkerDefaultImg" class="d-block w-100" width="600px" height="200px" src="../../Resource/Img/DefaultImg.jpg"
                                                alt="First slide" name="defaultImg" />
                                        </div>
                                        <img src="../../Resource/Img/alert.png" style="position: absolute; height: 10%; right: 0px; z-index: 1000; top: 0px;" id="alertImg" alt="alertImg" />
                                    </div>
                                    <a class="left carousel-control" href="#MarkerImgOutDiv" role="button" data-slide="prev">
                                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="sr-only">Previous</span> </a>
                                    <a class="right carousel-control" href="#MarkerImgOutDiv" role="button" data-slide="next">
                                        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span> </a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success glyphicon glyphicon-ok-circle" id="SaveEnteringDeviceInfo">
                        录入
                    </button>
                    <button type="button" class="btn btn-primary glyphicon glyphicon-off" data-dismiss="modal" id="CloseEnteringDeviceInfo">
                        关闭
                    </button>
                </div>
                <%--</div>--%>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal -->
        </div>
    </div>

    <%--带树状结构显示监测设备--%>
    <div class="modal fade " id="TreeDeviceInfoModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <%--  <div class="panel panel-info">--%>
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        &times;
                    </button>
                    <h4 class="modal-title H1">监测设备信息
                    </h4>
                </div>
                <div class="modal-body" id="tree-modal-body">
                    <div id="tree" style="width: 30%; float: left; overflow: scroll; height: 500px;">
                    </div>
                    <div style="width: 70%; float: right;">
                           <ul class="nav nav-tabs">
                        <li class="active"><a href="#BaseTreeMarkerInfoWin" data-toggle="tab">基本信息</a>
                        </li>
                        <li><a href="#TreepicMarkerWindows" data-toggle="tab">图片</a></li>
                    </ul>
                        <form id="TreeDeviceInfoForm">
                            <div class="tab-content">
                                 <div id="BaseTreeMarkerInfoWin" class="tab-pane fade in active ">
                            <table class="table table-striped table-bordered table-hover">
                                <tr>
                                    <td>监测类型:</td>
                                    <td>
                                        <select name="MonitorType">
                                            <option value="滑坡">滑坡</option>
                                            <option value="泥石流">泥石流</option>
                                        </select></td>
                                </tr>
                                <tr>
                                    <td>监测点名称:</td>
                                    <td>
                                        <input type="text" name="DeviceName" value="" /></td>
                                </tr>
                                <tr>
                                    <td>数采编号:</td>
                                    <td>
                                        <input type="text" name="ShuCaiNum" value="" /></td>
                                </tr>
                                <tr>
                                    <td>传感器编号:</td>
                                    <td>
                                        <input type="text" name="SensorNum" value="" /></td>
                                </tr>
                                <tr>
                                    <td>手机卡号:</td>
                                    <td>
                                        <input type="text" name="PhoneNum" value="" /></td>
                                </tr>
                                <tr>
                                    <td>钥匙:</td>
                                    <td>
                                        <input type="text" name="YaoshiNum" value="" /></td>
                                </tr>
                                <tr>
                                    <td>位置(经度):</td>
                                    <td>
                                        <input type="text" name="DeviceLon" value="" /></td>
                                </tr>
                                <tr>
                                    <td>位置(纬度):</td>
                                    <td>
                                        <input type="text" name="DeviceLat" value="" /></td>
                                </tr>
                                <tr>
                                    <td>备注:</td>
                                    <td>
                                        <input type="text" name="Beizhu" value="" /></td>
                                </tr>
                            </table>
                            <input type="hidden" name="Id" id="TreehiddenDeviceID" value="" />
                            <input type="hidden" name="MonitorName" value="" />
                            <input type="hidden" name="MonitorPointInfoId" value="" />
                            <input type="hidden" name="PointPicture" value="" />
                            <!--用来清空表单数据-->
                            <input type="reset" name="reset" id="resetInTreeDeviceInfoForm" style="display: none;" />
                                </div>

                                  <div id="TreepicMarkerWindows" class="tab-pane fade ">
                                <div id="TreeMarkerImgOutDivPic" class="carousel slide" data-ride="carousel">
                                    <ol class="carousel-indicators" id="TreeMarkerOLPic">
                                        <li id="TreeMarkerLiPic" data-target="#MarkerImgOutDivPic" data-slide-to="0" class="active"></li>
                                    </ol>
                                    <div class="carousel-inner" role="listbox" id="TreeMarkerImgDivPic">
                                        <div id="TreeMarkerImgNearDivPic" class="item active">
                                            <img id="TreeMarkerDefaultImgPic" class="d-block w-100" width="600px" height="200px" src="../../Resource/Img/DefaultImg.jpg"
                                                alt="First slide" name="defaultImg" />
                                        </div>
                                    </div>
                                    <a class="left carousel-control" href="#TreeMarkerImgOutDivPic" role="button" data-slide="prev">
                                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="sr-only">Previous</span> </a>
                                    <a class="right carousel-control" href="#TreeMarkerImgOutDivPic" role="button" data-slide="next">
                                        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span> </a>
                                </div>
                            </div>
                                 </div>
                        </form>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success glyphicon glyphicon-ok-circle" id="TreeSaveDeviceInfo">
                        保存
                    </button>
                    <button type="button" class="btn btn-danger glyphicon glyphicon-remove-circle" id="TreeDeleteDeviceInfo">
                        删除
                    </button>
                    <button type="button" class="btn btn-primary glyphicon glyphicon-off" data-dismiss="modal" id="TreeCloseDeviceInfo">
                        关闭
                    </button>
                </div>
                <%--</div>--%>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal -->
        </div>
    </div>

    <%--上传图片的窗口--%>
    <div class="modal fade" id="editImgModel" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="panel panel-info">
                    <div class="modal-header">
                        <!-- <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                                &times;
                            </button>-->
                        <h4 class="modal-title H1 " style="font-size: 30px;" id="H4">上传图片
                        </h4>
                    </div>
                    <div class="modal-body">
                        <div class="panel-body">
                            <div class="form-group">
                                <input id="editImgFile" accept="image/*" type="file" multiple="multiple" class="file" data-overwrite-initial="false" data-min-file-count="1" />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="deitImgClose" class="btn btn-primary glyphicon glyphicon-off" data-dismiss="modal">
                            关闭
                        </button>
                        <input type="hidden" id="hidImgId" name="name" value="" />
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal -->
        </div>
    </div>



        <%--更新图片的窗口--%>
    <div class="modal fade" id="ShowImgModel" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="panel panel-info">
                    <div class="modal-header">
                        <h4 class="modal-title H1 " style="font-size: 30px;">更新图片
                        </h4>
                    </div>
                    <div class="modal-body">
                        <div class="panel-body">
                            <div class="form-group">
                                <input id="ShowImgFile" accept="image/*" type="file" multiple="multiple" class="file" data-overwrite-initial="false" data-min-file-count="1" />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="ShowImgClose" class="btn btn-primary glyphicon glyphicon-off" data-dismiss="modal">
                            关闭
                        </button>
                        <input type="hidden" id="hidShowImgId" name="name" value="" />
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal -->
        </div>
    </div>
</body>
</html>
