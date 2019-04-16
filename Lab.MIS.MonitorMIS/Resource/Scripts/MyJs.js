/// <reference path="jquery-3.2.1.js" />

var map;
var map1;   //用来再录入界面显示的地图
var zoom = 12;
var open = true;
var handler, handler1;
var polygonTool;
var lineTool, markerTool;
var OptionsDict = "[";
var line3;
//判断用户是否登录
var isLog = false;
//聚合标记
var markers = null;
//标记数组
var arrayObj = [];
var newArray = [];
//用户名
var loginName = null;
//用来存放通过搜索显示的设备点
var SelectDevice = [];
//存放线条的数组
var linesArray = [];
//表示是否显示设备信息
var isShowDevice = false;
//是否打开功能栏
var isOpenFunc = false;
//表示是否打开预警查询窗口
var isOpenWarningWind = false;
//是否启动监测
var isStartMonitoring = false;
var interval = null;
var interval1 = null;
var interval2 = null;
//判断目前所属是否为卫星图
var Imglayer = false;
//判断目前所属是否为地形图
var Terlayer = false;
//用于小地图
//判断目前所属是否为卫星图
var Imglayer1 = false;
//判断目前所属是否为地形图
var Terlayer1 = false;
//判断输入数据是否符合条件
var IsEnteringDataLegal = true;
//经度
var isLegalLon = true;
//纬度
var isLegalLat = true;
//流量卡
var isLegalPhoneNum = true;
//监测阵列编号
var isLegalMonitorNum = true;
//监测阵列名称
var isLegalMonitorName = true;
//监测点名称
var isLegalDeviceName = true;

//判断录入监测阵列时必填项是否填写
var isInputNecessaryForMonitor
//判断录入检测设备是否填写必填项目
var isInputNecessaryForDevice
//用于判断工具是否添加
var bool1 = false, bool2 = false, bool3 = false, bool4 = false, bool5 = false;
//图层url
var imageURL = "http://t0.tianditu.gov.cn/img_w/wmts?" +
                "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
                "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=13c0656131839342ffae4a5588c770ec";

// var imageURL = "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles";
//创建自定义图层对象
var imageURL2 = "http://t0.tianditu.gov.cn/ter_w/wmts?" +
                "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
                "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=13c0656131839342ffae4a5588c770ec";
var lay = new T.TileLayer(imageURL, { minZoom: 1, maxZoom: 18 });
var lay2 = new T.TileLayer(imageURL2, { minZoom: 1, maxZoom: 18 });
var slay = new T.TileLayer(imageURL, { minZoom: 1, maxZoom: 18 });
var slay2 = new T.TileLayer(imageURL2, { minZoom: 1, maxZoom: 18 });
//所有通过table查询出来的点击的marker
var DiseaseMarkerArray = [];
//阵列id
var group_id = [];


///初始化函数

var textURL = "http://t3.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=13c0656131839342ffae4a5588c770ec";
var textlay = new T.TileLayer(textURL, { minZoom: 1, maxZoom: 18 });
var stextlay = new T.TileLayer(textURL, { minZoom: 1, maxZoom: 18 });

var map1Marker; //副地图上面的一个用来回去经纬度的marker;

var SecondaryMapDescribtion;    // 用来判断是哪一个模块调用的副地图
var requireLoadNum = 0;         // 用来判断是否加载预警数据到表格完成
var requireLoadNowNum = 0;      // 当前加载预警阵列ID

var testTImeStamp = 1512403200; // 测试版本的时间戳   2017-12-05-00:00:00

$(document).ready(function () {


    //隐藏loading
    $("#LoadingGif").css("display", "none");
    //绑定搜索栏事件
    BindSelectConfirmBtn();
    BindSelectResetBtn();
    BindSelectOptions();
    BindSelectChange();

    //日期选择器的配置
    $(".form_datetime").datetimepicker({
        format: "yyyy-mm-dd hh:ii:ss",
        autoclose: true,
        todayBtn: true,
        startDate: "2013-02-14 10:00",
        minuteStep: 10
    });
    //为leftDiv添加拖动
    var doc = $(document), dl = $("#side_bar");
    var sum = dl.width() +
        $("#handlerDiv").mousedown(function (e) {
            var me = $(this);
            var deltaX = e.clientX - (parseFloat(me.css("left")) || parseFloat(me.prop("clientLeft")));
            lt = e.clientX;
            doc.mousemove(function (e) {
                lt = e.clientX;
                lt = lt < 450 ? 450 : lt;
                me.css("left", lt + "px");
                dl.width(lt);
            });
        }).width();
    doc.mouseup(function () {
        doc.unbind("mousemove");
    });


    //为模态对话框添加拖拽
    $(".modal").draggable();
    $(".modal-dialog").draggable();


    //$(".modal").draggable({ cancel: ".title"});
    //$(".modal-content").draggable();



    map = new T.Map('mapDiv');
    map.centerAndZoom(new T.LngLat(109.34692, 30.96348), 9);    // 修改时间：2019.04.16 直接展示奉节县中心点
    //用来再录入页面显示的地图
    map1 = new T.Map('GetPointMapDiv');
    map1.centerAndZoom(new T.LngLat(109.34692, 30.96348), 9);
    //添加缩放按钮
    control = new T.Control.Zoom();
    control.setPosition(T_ANCHOR_BOTTOM_LEFT);
    //map1.addControl(control);
    map.addControl(control);
    //添加比例尺
    var scale = new T.Control.Scale();
    map.addControl(scale);
    var scale1 = new T.Control.Scale();
    map1.addControl(scale1);
    //在map1上设置可拖动的一个点来确定用户选择经纬度
    var point = new T.LngLat(109.34692, 30.96348);
    map1Marker = new T.Marker(point);       // 创建标注
    map1.addOverLay(map1Marker);                // 将标注添加到地图中
    map1Marker.enableDragging();                // 不可拖拽
    map1.addEventListener("click", Map1Click);   // 给map1添加点击功能、用户一点就让marker定位到那个位置
    map1Marker.addEventListener("drag", SetLnLatByDrag);//给这个标记添加移动事件
    BindLngLatTextChange();               //给录入的经纬度两个inputtext框注册失去焦点事件

    MoveControl();
    $("#side_barController").click(function () {
        isOpenWarningWind = !isOpenWarningWind;
        if (!isOpenWarningWind) {  //如果没有打开窗口，点击后打开
            $("#openWarningSelectWind").find("span").attr({
                "class": "menu-item-spanf glyphicon glyphicon-zoom-out",
                "title": "关闭预警查询",
            }).tooltip("fixTitle");
            $("#side_barController")[0].title = "关闭查询";
        } else {
            $("#openWarningSelectWind").find("span").attr({
                "class": "menu-item-spanf glyphicon glyphicon-zoom-in",
                "title": "展开预警查询",
            }).tooltip("fixTitle");
            $("#side_barController")[0].title = "展开查询";
        }
        MoveLeftWindow();
    });
    var config = {
        showLabel: true,
        color: "blue", weight: 3, opacity: 0.5, fillColor: "#FFFFFF", fillOpacity: 0.5
    };
    lineTool = new T.PolylineTool(map, config);
    polygonTool = new T.PolygonTool(map, config);
    var config = {
        showLabel: true,
        color: "blue", weight: 3, opacity: 0.5, fillColor: "#FFFFFF", fillOpacity: 0.5
    };
    //创建标注工具对象
    var polygonTool = new T.PolygonTool(map, config);
    markerTool = new T.MarkTool(map, { follow: true });
    $("#MeasureLength").click(function () {
        lineTool.open();
        bool1 = true;
    });
    $("#MeasureArea").click(function () {
        polygonTool.open();
        bool2 = true;
    });
    $("#MeasurearkPoint").click(function () {
        editMarker();
        markerTool.open();
        bool3 = true;
    });
    $("#MarkLine").click(function () {
        if (handler) handler.close();
        handler = new T.PolylineTool(map);
        handler.open();
        bool4 = true;
    });
    $("#MarkArea").click(function () {
        if (handler1) handler1.close();
        handler1 = new T.PolygonTool(map);
        handler1.open();
        bool5 = true;
    });
    $("#clearOverLays").click(function () {
        if (bool1) {
            lineTool.clear();
        }
        if (bool2) {
            polygonTool.clear();
        }
        if (bool3) {
            markerTool.clear();
        }
        if (bool4) {
            handler.clear();
        }
        if (bool5) {
            handler1.clear();
        }
        $("#SearchText").val("");
        $("#TableBody").html("");
    });



    //窗口大小改变时适应页面

    $(".dropdown-menu").animate({ left: '-65px' }, 100);

    //获取滚动条高度
    var scroll_height = $("#SearchDiseaseInfoDiv")[0].offsetHeight - $("#SearchDiseaseInfoDiv")[0].scrollHeight;

    //使side_bar高度等于窗口高度-headDiv高度
    var n = document.getElementById("side_bar");
    n.style.height = document.documentElement.offsetHeight - document.getElementById("headDiv").clientHeight - 2 + "px";

    //使SearchDiseaseInfoDiv高度等于side_bar高度-SearchMainTable高度
    var m = document.getElementById("SearchDiseaseInfoDiv");
    m.style.height = document.getElementById("side_bar").clientHeight - document.getElementById("SearchMainTable").clientHeight - document.getElementById("btng").clientHeight - scroll_height + "px";


    $(window).resize(function () {
        if ($("#ChangeSearchParameters").is(":hidden")) {
            n.style.height = document.documentElement.offsetHeight - document.getElementById("headDiv").clientHeight - 4 + "px";
            m.style.height = document.getElementById("side_bar").clientHeight - document.getElementById("ChangeSearchParameters").clientHeight - document.getElementById("SearchMainTable").clientHeight - document.getElementById("btng").clientHeight - scroll_height + "px";
        } else {
            n.style.height = document.documentElement.offsetHeight - document.getElementById("headDiv").clientHeight - 4 + "px";
            m.style.height = document.getElementById("side_bar").clientHeight - document.getElementById("ChangeSearchParameters").clientHeight - document.getElementById("SearchMainTable").clientHeight - document.getElementById("btng").clientHeight - scroll_height + 320 + "px";
        }

    });



    //动态搜索框
    $(".search-button").click(function () {
        $(this).parent().toggleClass("open");
        if ($(".search-button").parent().hasClass("open")) {
            $("#SearchText")[0].focus();
        };
    });
    $(".menu-open-button").click(function () {
        if (!isOpenFunc) {
            $("#titleLabel")[0].title = "关闭功能栏"
            isOpenFunc = !isOpenFunc;
        } else {
            $("#titleLabel")[0].title = "打开功能栏"
            isOpenFunc = !isOpenFunc;
        }

        $(".search-button").parent().removeClass("open");
        $("#SearchText").val("");
        $("#TableBody").html("");
    });

    $("[data-toggle='tooltip']").tooltip();

    //图层框收缩
    $("#LayerContent").click(function () {
        $(".row ").animate({ width: 'toggle' }, 350);
    });
    //小地图图层框收缩
    $("#LayerContent1").click(function (ev) {
        $(".row1 ").animate({ width: 'toggle' }, 350);

        var oEvent = ev || event;

        //js阻止事件冒泡
        oEvent.cancelBubble = true;
        oEvent.stopPropagation();
    });




    //点击登录按钮 
    $("#mine").click(function () {
        openLoginModal();
    });

    //点击确定登录 提交数据
    $("#btnLogin").click(function () {
        //调用验证登录方法
        loginAjax();
    });

    var config2 = {
        pageCapacity: 10,	//每页显示的数量
        onSearchComplete: localSearchResult	//接收数据的回调函数
    };
    //创建搜索对象
    localsearch = new T.LocalSearch(map, config2);
    localsearch.search("奉节县");


    //显示隐藏监测设备按钮
    $("#showDevice").click(function () {
        if (!isShowDevice) {
            $("#showDevice").find("span").attr({
                "class": "menu-item-spanf glyphicon glyphicon-eye-close",
                "title": "隐藏地图上的监测点",
            }).tooltip("fixTitle");//.tooltip("show");
            ShowDevice(null);
            isShowDevice = true;
        } else {
            //表示当前地图中的所有标记
            //var AllOverlays = map.getOverlays();
            //$.each(AllOverlays, function (AllOverlays_Index, item) {
            //    //if (item.getType() == 2) {
            //    //    map.removeOverLay(item);
            //    //}
            //    //删除线条
            //    if (item.getType() == 4) {
            //        map.removeOverLay(item);
            //    }
            //});


            //清空设备连线
            if (linesArray.length > 0) {
                $.each(linesArray, function (i, item) {
                    item.hide();
                });
            }
            //如果通过搜索显示的设备不为空
            if (SelectDevice.length > 0) {
                $.each(SelectDevice, function (i, item) {
                    item.hide();
                });
            }
            SelectDevice = [];
            //如果显示检测设备点，则删除
            if (arrayObj.length > 0) {
                //删除聚合标记
                // markers.removeMarkers(newArray);

                $.each(arrayObj, function (i, item) {
                    item.hide();
                });
            }
            arrayObj = [];
            $("#showDevice").find("span").attr({
                "class": "menu-item-spanf glyphicon glyphicon-eye-open",
                "title": "显示地图上的监测点",
            }).tooltip("fixTitle");//.tooltip("show");
            isShowDevice = false;
        }

    });

    //打开、关闭预警查询窗口
    $("#openWarningSelectWind").click(function () {
        $("#side_barController").click();
    });

    //打开关闭监测
    $("#startMonitoring").click(function () {
        UpdateOneMinute();
    });

    //添加地图的缩放改变事件  请勿删除
    // map.addEventListener("zoomstart", MapGetZoom);

    //删除监测设备信息
    $("#DeleteDeviceInfo").click(function () {
        //获取隐藏于id
        var getHiddenId = $("#hiddenDeviceID").val();
        DeleteDeviceInfo(getHiddenId, "#CloseDeviceInfo");
    });

    //保存监测设备信息
    $("#SaveDeviceInfo").click(function () {
        //获取表单数据
        var getData = $("#DeviceInfoForm input, #DeviceInfoForm select");
        SavaDevideInfo(getData, "#CloseDeviceInfo");
    });
    //改变图层到卫星图层
    $("#layertoimg").click(function () {
        layerToImg();
    });
    //改变图层到地形图层
    $("#layertoter").click(function () {
        layerToTer();
    });
    //原始图层
    $("#layertoori").click(function () {
        layerToOri();
    });
    //小地图的图层变换
    //改变图层到卫星图层
    $("#layertoimg1").click(function (ev) {
        layerToImg1();
        var oEvent = ev || event;

        //js阻止事件冒泡
        oEvent.cancelBubble = true;
        oEvent.stopPropagation();
    });
    //改变图层到地形图层
    $("#layertoter1").click(function (ev) {
        layerToTer1();
        var oEvent = ev || event;

        //js阻止事件冒泡
        oEvent.cancelBubble = true;
        oEvent.stopPropagation();
    });
    //原始图层
    $("#layertoori1").click(function (ev) {
        layerToOri1();
        var oEvent = ev || event;

        //js阻止事件冒泡
        oEvent.cancelBubble = true;
        oEvent.stopPropagation();
    });

    //打开录入监测阵数据窗口
    $("#EnteringMonitorInfo").click(function () {
        OpenEnteringMonitorInfo();
    });

    //录入监测阵数据
    $("#EnteringMonitorInfoBtn").click(function () {
        EnteringMonitorInfo();
    });

    BindClickRemoveWarningPointBtn();


    //打开录入监测设备信息窗口
    $("#EnteringDeviceInfo").click(function () {
        OpenEnteringDeviceInfo();
        //将所有的输入错误去除
        $(".popover-content, .arrow").parent().popover('destroy');
    });

    //录入监测设备信息
    $("#SaveEnteringDeviceInfo").click(function () {
        EnteringDeviceInfo();
    });

    //删除监测阵列
    $("#deleteMonitorWind").click(function () {
        // 跟新阵列信息
        GetDeleteTree();                            // 加载删除设备 or 阵列的 tree
        OpenDeleteMonitorWinfo();
    });

    //下拉列表改变事件
    $("#DeviceSelect").change(function () {
        //获取监测阵列id
        var getSelectVal = $("#DeviceSelect").val();
        $("#MonitorPointInfoId").val(getSelectVal);
        $.ajax({
            url: "/Home/GetOneMonitorPointInfo",
            type: "POST",
            data: { id: getSelectVal },
            success: function (backData) {
                $("#MonitorType").html(backData);

            }

        });
    });

    //tree详情管理
    $("#showAllDevice").click(function () {
        OpenTreeDeviceWindow();
    });

    //tree详情管理中删除监测设备
    $("#TreeDeleteDeviceInfo").click(function () {
        //获取隐藏于id
        var getHiddenId = $("#TreehiddenDeviceID").val();
        if ($("#hidShowImgId").val()) {
            DeleteDeviceInfo(getHiddenId, null);
        } else {
            swal({
                title: "请先选中数据！",
                type: "warning",
                timer: 1500
            });
        }
    });

    //tree详情管理中保存监测设备
    $("#TreeSaveDeviceInfo").click(function () {
        //获取表单数据
        var getData = $("#TreeDeviceInfoForm input, #TreeDeviceInfoForm select");
        if ($("#hidShowImgId").val()) {
            SavaDevideInfo(getData, null);
        } else {
            swal({
                title: "请先选中数据！",
                type: "warning",
                timer: 1500
            });
        }

    });

    //恢复初始状态按钮
    $("#getReset").click(function () {
        //map.centerAndZoom(new T.LngLat(109.34692, 30.96348), 14);
        //显示最佳视图
        map.setViewport(pointsArr);
    });
    //绑定搜索栏改变事件
    BindVagueSelectInputChange();
    //绑定清空查询
    BindClearVagueSelect();

    //图片上传处理
    LoadingImg();

    //读取cookie
    //读取coockie写入text
    document.getElementById("UserIdText").value = getCookie("UserName");
    loginName = getCookie("UserName");
    document.getElementById("UserPwdText").value = getCookie("UserPwd");
    var boolLog = getCookie("IsLog");
    if (boolLog == "true") {
        isLog = true;
        logstate();
        $("#btnLogin").val("已登录,点击退出登录");
    }

    //当上传图片的model隐藏时
    $("#editImgModel").on('hide.bs.modal', function () {
        HidenLoadingImgModel();
    });

    //关闭录入监测设备的model隐藏时
    $("#EnteringDeviceInfoModal").on('hide.bs.modal', function () {
        HidenEnteringDeviceModel();
    });


    //当树状model关闭时，将更新图片的隐藏域清空
    $("#TreeDeviceInfoModal").on('hide.bs.modal', function () {
        //将更新图片的隐藏域清空
        $("#hidShowImgId").val("");
    });


    //当点击Marker展示 model关闭时，将更新图片的隐藏域清空
    $("#DeviceInfoModal").on('hide.bs.modal', function () {
        //将更新图片的隐藏域清空
        $("#hidShowImgId").val("");
    });


    //关闭更新图片的model隐藏时
    $("#ShowImgModel").on('hide.bs.modal', function () {
        var getid = $("#hidShowImgId").val();
        HidenShowImgModel(getid);
    });


    //将右边的框隐藏
    $("#side_barController").click();

    //判断是隐藏还是显示
    isShowOrHide();

    //录入信息的时候在地图上面取点
    BindGetPointByMap();

    //先把副地图给隐藏了、 注意不能之前就设置为null、必须等加载地图之后
    HideViceMap();

    //在录入的界面关闭后也关闭副地图
    $('#EnteringDeviceInfoModal').on('hide.bs.modal', function () {
        HideViceMap();
    });
    $('#TreeDeviceInfoModal').on('hide.bs.modal', function () {
        HideViceMap();
    });
    $('#DeviceInfoModal').on('hide.bs.modal', function () {
        HideViceMap();
    });

    //点击图标关闭副地图
    $("#closeMap").click(function (ev) {
        var oEvent = ev || event;
        oEvent.cancelBubble = true;
        oEvent.stopPropagation();
        HideViceMap();
        $("#GetPointByMap")[0].title = '在地图上取点';
        $("#GetPointByMap1")[0].title = '在地图上取点';
        $("#GetPointByMap2")[0].title = '在地图上取点';

    });

    // 设置搜索栏的时间值 -- 正式版本
    //var timestamp = Math.round(new Date() / 1000);
    //var NowTime = getFormatDate(timestamp).substr(0, 10).replace(/\//g, '-');
    //var NowSecond = getFormatDate(timestamp).substr(11, 8);

    //timestamp = timestamp - 60;
    //var BeforeTime = getFormatDate(timestamp).substr(0, 10).replace(/\//g, '-');
    //var BeforeSecond = getFormatDate(timestamp).substr(11, 8);

    //$("#beforeTimeDate").val(BeforeTime);
    //$("#beforeTimeHMS").val(BeforeSecond);
    //$("#endTimeDate").val(NowTime);
    //$("#endTimeHMS").val(NowSecond);

    // 测试版本 以 2017-12-05 00:00:00 -> 2017-12-05 00:01:00 为例
    $("#beforeTimeDate").val("2017-12-05");
    $("#beforeTimeHMS").val("00:00:00");
    $("#endTimeDate").val("2017-12-05");
    $("#endTimeHMS").val("00:01:00");

    // 每隔两分钟刷新一次预警点信息
    UpdateOneMinute();
    $("#showDevice").click();


    $("#exportExcelBtn").click(ExportExcel);    // 导出



    $("#EnteringDeleteMonitorInfoBtn").click(function () {
        //判断是否登录
        if (isLog == false) {
            swal({
                title: "请先登录！",
                type: "warning",
                timer: 1500
            });
            openLoginModal();
            return;
        }

        swal({
            title: "您确定要删除吗？",
            text: "删除监测阵列，则该阵列的所有监测设备都会被删除！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6CE26C",
            confirmButtonText: "确定删除！",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    deleteDeviceOrMonitor();
                } else {
                    swal({
                        title: "已取消",
                        type: "success",
                        timer: 1500
                    });
                }
            }
        );


    });



});

var size = 1.0;
function zoomout() {
    size = size + 0.1;
    set();
}
function zoomin() {
    size = size - 0.1;
    set();
}


function set() {
    //document.body.style.cssText = document.body.style.cssText + '; -webkit-transform: scale(' + size + ');-webkit-transform-origin: 0 0;';   
    //document.body.style.cssText = document.body.style.cssText + '; -webkit-transform: scale(' + size + '); '; 
    //$(body).css("width","120%);
    document.body.style.zoom = size;
    document.body.style.cssText += '; -moz-transform: scale(' + size + ');-moz-transform-origin: 0 0; ';     //
}


// 删除监测阵列 或者 检测设备
function deleteDeviceOrMonitor() {
    // 分别存放检测设备 ID 和监测阵列 ID, parentNodeID 是判断关系的，即如果 parentID 被选择了，那么再选择 sonNodeID 就无效了
    var deviceIdList = [];
    var monitorIdList = [];
    var parentNodeID = [];
    var selectedItemList = $('#treeview-checkable').treeview('getSelected');
    $.each(selectedItemList, function (i, tmpItem) {
        if (tmpItem.tags[0].split(",")[0] == "阵列") {           // format: (tmpItem.tags[0].split(",") = ["阵列 or 监测点", "ID"]
            $.each(tmpItem.nodes, function (i, item) {           // 将该阵列下的设备 id 加入 deviceIdList
                deviceIdList.push(item.tags[0].split(",")[1]);
            });
            parentNodeID.push(tmpItem.nodeId);                   // 仅仅用来判断.
            monitorIdList.push(tmpItem.tags[0].split(",")[1]);
        }
        else if (parentNodeID.indexOf(tmpItem.parentId) == -1) { // 即上述注释，该设备的阵列没有被选择时才添加该设备进入删除项。
            deviceIdList.push(tmpItem.tags[0].split(",")[1]);
        }
    });

    var fd = new FormData();
    fd.append("monitorIdList", monitorIdList);
    fd.append("deviceIdList", deviceIdList);
    $.ajax({
        type: "POST",
        url: "/Home/DeleteMonitorAndDevice",
        data: fd,
        contentType: false,
        processData: false,
        dataType: "text",
        success: function (response) {
            if (response == "0") {          // 删除成功之后提示、并且重新加载 tree 和 刷新页面显示点
                GetDeleteTree();            // 重新加载 tree
                $("#showDevice").click();   // 刷新
                $("#showDevice").click();
                swal({
                    title: "删除成功！",
                    type: "success",
                    timer: 1500
                });
            }
        },
        error: function (e) {
            alert("失败");
        }
    });
}

//获取缩放级别
function MapGetZoom(e) {

    //alert(map.getZoom());
    //if (map.getZoom()>=12) {
    //    //将聚合标记移除
    //    markers.removeMarkers(arrayObj);
    //}
    //alert(markers.getGridSize());
    //markers.setGridSize(1);
}

//移动控件的位置
function MoveControl() {
    var controlPosition = T_ANCHOR_BOTTOM_RIGHT;
    control.setPosition(controlPosition);
}

//左窗口的移动
function MoveLeftWindow() {
    if (open == true) {
        $("#side_bar").animate({ left: '-' + $("#side_bar").width() + 'px' }, 100);
        open = false;
    }
    else {
        $("#side_bar").animate({ left: '0px' }, 100);
        open = true;
    }
}

//标记点函数
function editMarker() {
    var markers = markerTool.getMarkers()
    for (var i = 0; i < markers.length; i++) {
        markers[i].enableDragging();
    }
}

//打开登录窗口
function openLoginModal() {

    //填充信息
    $('#loginModal .registerBox').fadeOut('fast', function () {
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast', function () {
            $('.login-footer').fadeIn('fast');
        });

        $('.modal-title.logIn').html('登录');
    });
    $('.error').removeClass('alert alert-danger').html('');
    //打开窗口
    $('#loginModal').modal('show');

}

//回调函数 用于接收搜索出来的边界坐标
function localSearchResult(result) {
    //用于解析行政区边界，并画边界线
    area(result.getArea());
}

//坐标数组，设置显示最佳视图时会用到
var pointsArr = [];

//用于解析行政区边界，并画边界线
function area(obj) {
    if (obj) {
        
        var points = obj.points;
        for (var i = 0; i < points.length; i++) {
            var regionLngLats = [];
            var regionArr = points[i].region.split(",");
            for (var m = 0; m < regionArr.length; m++) {
                var lnglatArr = regionArr[m].split(" ");
                var lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);
                regionLngLats.push(lnglat);
                pointsArr.push(lnglat);
            }
            //创建线对象
            var line1 = new T.Polyline(regionLngLats, {
                color: "#191970",
                weight: 3,
                opacity: 1,
                lineStyle: "dashed"
            });
            var line2 = new T.Polyline(regionLngLats, {
                color: "#191970",
                weight: 3,
                opacity: 1,
                lineStyle: "dashed"
            });
            //向地图上添加线
            map.addOverLay(line1);
            map1.addOverLay(line2);
            //创建面对象
            var polygon1 = new T.Polygon(regionLngLats, {
                color: "#191970", weight: 3, opacity: 0.5, fillColor: "#8B7B8B", fillOpacity: 0.5
            });
            //向地图上添加面
            //map.addOverLay(polygon1);
        }

        //显示最佳视图
        map.setViewport(pointsArr);
    }
}

//验证登录
function loginAjax() {
    //如果已经登录，点击将退出登录
    if (isLog == true) {
        logoff(function () {
            isLog = false;
            logstate();
            swal({
                title: "退出登录成功！",
                type: "success",
                timer: 1500
            });
            $("#btnLogin").val("登录");
        });
    } else {
        //将表单整体序列化成一个数组提交到后台
        var postData = $("#loginForm").serializeArray();
        loginName = postData[0].value;
        $.post("/Home/Login", postData, function (data) {
            if (data["state"] != false) {
                isLog = true;
                logstate();
                $('#loginModal').modal('hide');
                //禁用登录按钮
                $("#btnLogin").val("已登录,点击退出登录");

                swal({
                    title: "登录成功！",
                    type: "success",
                    timer: 1500
                });
            } else {
                shakeModal(data);
            }
        });
    }
}

function logstate() {
    if (isLog) {
        $("#mine").find("span")[0].innerHTML = "";
        $("#mine").find("span").css("font-size", "20px");
        $("#mine").find("span").attr({
            "class": "menu-item-spanf glyphicon glyphicon-user",
            "title": "点击退出登录",
        }).tooltip("fixTitle");
        $("#logonState")[0].innerText = "已登录" + ",用户名:" + loginName;
    } else {
        $("#mine").find("span")[0].innerHTML = "登录";
        $("#mine").find("span").css("font-size", "15px");
        $("#mine").find("span").attr({
            "class": "menu-item-spanf",
            "title": "点击登录",
        }).tooltip("fixTitle");
        $("#logonState")[0].innerText = "未登录";


    }

}

//登录窗口震动
function shakeModal(data) {
    $('#loginModal .modal-dialog').addClass('shake');
    $('.error').addClass('alert alert-danger').html("登录失败");
    $('input[type="password"]').val('');
    setTimeout(function () {
        $('#loginModal .modal-dialog').removeClass('shake');
    }, 400);
}

//sweetalert
function logoff(Func) {
    swal({
        title: "您确定要退出登录吗",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#6CE26C",
        confirmButtonText: "确定退出！",
        cancelButtonText: "取消",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {
                Func();
            } else {
                swal({
                    title: "已取消",
                    type: "success",
                    timer: 1500
                });
            }
        }
    );
}

//绑定搜索栏的下拉select options
function BindSelectOptions() {
    $.ajax({
        url: "/Home/GetMonitorInfos",
        type: "Post",
        dataType: "Json",
        success: function (result) {
            var postRes = $.parseJSON(result);
            $("#searchSelect").empty();
            $("#searchSelect").append("<option value='" + 0 + "'>" + '全选' + "</option>");
            $(postRes).each(function (i, item) {
                $("#searchSelect").append("<option value='" + item.MonitorId + "'>" + item.Name + "</option>");
                OptionsDict += "{ \"value\":\"" + item.MonitorId + "\" , \"Key\":\"" + item.Name + "\" },";
            });
            OptionsDict = OptionsDict.slice(0, OptionsDict.length - 1) + "]";
            //获取的Json对象  监测块ID和监测块
            OptionsDict = $.parseJSON(OptionsDict);
        }
    });
}

//绑定搜索栏下拉select 改变事件
function BindSelectChange() {
    $("#searchSelect").change(function () {
    });
}

//绑定搜索栏确定按钮
function BindSelectConfirmBtn() {
    $("#selectConfirmBtn").click(function () {
        $("#SearchDiseaseInfoTable").empty();
        $("#SearchDiseaseInfoTable")
                .append(
                    "<caption>监测预警查询结果</caption><thead><tr><th>监测阵列</th><th>阵经度</th><th>阵纬度</th><th>经度</th><th>纬度</th><th>预警方位</th><th>监测类型</th><th>预警等级</th><th>预警时间</th></tr></thead><tbody></tbody>");

        var arrayId = $("#SearchMainTable option:selected").val();
        if (arrayId != 0) {
            requireLoadNowNum = 0;
            requireLoadNum = 1;
            loadDataToTable(arrayId);
        } else {
            var array = $("#searchSelect option:not(:selected)");
            for (var i = 0; i < array.length; i++) {
                requireLoadNowNum = 0;
                requireLoadNum = array.length;
                loadDataToTable(array[i].value);
            }
        }
    });

    //鼠标滚动图框上移

    var mouseon = 0;
    $('#SearchDiseaseInfoTable').on('mousewheel', function (event) {
        if (deltaY = -1 && mouseon == 0) {
            $('#btng').animate({ top: '-320px', }, 100);
            $('#SearchMainTable').css("filter", "blur(23px)");
            $('#ChangeSearchParameters').css("display", "block");
            $('#ChangeSearchParameters').animate({ top: '-320px', }, 100);

            $('#SearchDiseaseInfoDiv').animate({
                top: '-320px',
                height: '+=260px',
            }, 100);
            $('#side_bar').animate({ height: '-=260px', }, 1);
        }
        mouseon++;
    });

    //$("#ChangeSearchParameters").is(":hidden")
    // 点击修改参数图框下移
    $('#SearchMainTable,#ChangeSearchParameters').click(function () {
        if ($("#ChangeSearchParameters").is(":visible")) {
            $('#SearchDiseaseInfoDiv').animate({ top: '0px', height: '-=260px', }, 100);
            $('#btng').animate({ top: '0px', }, 100);
            $('#SearchMainTable').css("filter", "blur(0px)");
            $('#ChangeSearchParameters').css("display", "none");
            $('#side_bar').animate({ height: '+=260px', }, 1);
            mouseon = 0;
        }
    });
}

// 绑定搜索栏重置按钮
function BindSelectResetBtn() {
    $("#selectResetBtn").click(function () {
        $("#SearchDiseaseInfoTable").empty();
        $("#SearchDiseaseInfoTable").append("<caption>监测预警查询结果</caption>");
        $("#SearchDiseaseInfoTable").append("<thead></thead>");
        $("#SearchDiseaseInfoTable thead").append("<tr></tr>");
        $("#SearchDiseaseInfoTable thead tr").append("<th>监测阵列</th><th>阵经度</th><th>阵纬度</th><th>经度</th><th>纬度</th><th>预警方位</th><th>监测类型</th><th>预警等级</th><th>预警时间</th>");
    });
}

// 获取对应arrayId的数据加载到table里面 
function loadDataToTable(arrayId) {
    var urlString = "/Home/GetDiseaseInfo";
    //Load loading gif
    $("#LoadingGif").css("display", "inline");
    $.ajax({
        url: urlString,
        type: "Get",
        dataType: "Json",
        timeout: 2000000,
        data: {
            arrayId: arrayId,
            beforeTime: convertFormat($("#beforeTimeDate").val()) + " " + $("#beforeTimeHMS").val(),
            endTime: convertFormat($("#endTimeDate").val()) + " " + $("#endTimeHMS").val()
        },
        success: function (result) {
            var tmpjsonOb = eval("(" + result + ")");
            var appendStr = "";

            $.each(tmpjsonOb, function (i, tmpItem) {
                //不加载等级为0的预警点
                if (tmpjsonOb[i]["Grade"] != 0) {
                    //alert(tmpItem["Type"]);
                    var SelectedType = $("#searchSelectType option:selected").html();
                    if (SelectedType == "全选" || tmpItem["Type"] == SelectedType) {
                        //0是类型全选，1是滑坡，2是泥石流
                        var item = tmpjsonOb[i];
                        appendStr += "<tr><td>";
                        for (j in tmpjsonOb[i]) {
                            if (j == "ArrayID") {
                                //ArrayID  要换成对应的中文， 用到一个全局的                      
                                for (tmpj in OptionsDict) {
                                    if (OptionsDict[tmpj].value == tmpjsonOb[i][j]) {
                                        appendStr += OptionsDict[tmpj].Key + "</td><td>";
                                    }
                                }
                            } else {
                                appendStr += tmpjsonOb[i][j] + "</td><td>";
                            }
                        }
                        appendStr = appendStr.slice(0, appendStr.length - 4);
                        appendStr += "</tr>";
                    }
                }
            });
            $("#SearchDiseaseInfoTable").append(appendStr);
            BindClickRow();
            requireLoadNowNum++;   // 当前阵列完成
            if (requireLoadNowNum == requireLoadNum) {
                // 表示所有阵列完成加载、隐藏loading
                $("#LoadingGif").css("display", "none");
            }

        },
        error: function (xhr, status, error) {
            // alert(status + "," + error);
            swal({
                title: status + "," + error,
                type: "error",
                timer: 1500
            });
        }
    });
}

// 点击表格行加载对应受灾害点
function BindClickRow() {
    $("#SearchDiseaseInfoTable tr").click(function () { //给每行绑定了一个点击事件：var td = $( this ).find( "td" );
        var td = $(this).find("td");
        var RowData = [
            td.eq(0).html(), td.eq(1).html(), td.eq(2).html(), td.eq(3).html(), td.eq(4).html(), td.eq(5).html(),
            td.eq(6).html(), td.eq(7).html(), td.eq(8).html()
        ];
        AddWarningPointToMap(RowData, false);           // 修改时间：2019.04.16
    });
}

// 修改时间：2019.04.16
// 添加单个预警点点到地图上并绑定点击事件, isIntervalReturn = true: 指每隔指定时间自动监测的对象，= false：指的是点击左侧表格所添加的对象点。
function AddWarningPointToMap(RowData, isIntervalReturn) {
    var data = RowData[3] + ", " + RowData[4] + ", " + RowData[7];

    if (RowData[7] == "泥石流") {
        //创建图片对象
        icon = new T.Icon({
            iconUrl: "../../Resource/Img/mud/" + RowData[7] + ".gif",
            iconSize: new T.Point(20, 30),  //T.Point(40, 50)
            iconAnchor: new T.Point(10, 30)
        });
    } else {
        //创建图片对象
        icon = new T.Icon({
            iconUrl: "../../Resource/Img/coast/" + RowData[7] + ".gif",
            iconSize: new T.Point(20, 30),
            iconAnchor: new T.Point(10, 30)
        });
    }

    // 创建标注
    var marker = new T.Marker(new T.LngLat(RowData[3], RowData[4]), { icon: icon });
    DiseaseMarkerArray.push(marker);
    //arrayObj.push(marker);

    // 获取标记文本, 即鼠标移上图片所显示的文字 修改时间：2019.04.11
    // 将 array id 替换为相应的检测阵列 中文
    var monitorDeviceName = "";
    if (isIntervalReturn == true) {
        for (tmpj in OptionsDict) {
            if (OptionsDict[tmpj].value == RowData[0]) {
                monitorDeviceName = OptionsDict[tmpj].Key;
            }
        }
    } else {
        monitorDeviceName = RowData[0];
    }

    var content = "<b>预警信息</b>"+"<br>监测阵列：" + monitorDeviceName + "<br>预警类型：" + RowData[6] + "<br>预警等级：" + RowData[7];

    // 将标注添加到地图中
    map.addOverLay(marker);
    // 将地图的中心移动至此标记点
    var Lon = RowData[3];
    var Lat = RowData[4];
    map.centerAndZoom(new T.LngLat(Lon, Lat), 14);
    // 注册标记的鼠标触摸,移开事件           
    addClickHandler(content, marker, RowData, true);
}

// 绑定移除预警点信息按钮、清空数组
function BindClickRemoveWarningPointBtn() {
    $("#RemoveWarningPointBtn").click(function () {
        $.each(DiseaseMarkerArray, function (i, item) {
            item.hide();
        });
        DiseaseMarkerArray = [];
    });
}

// 将YY-MM-DD 转换为 YY/MM/DD
function convertFormat(str) {
    var reg = new RegExp("-", "g");//g,表示全部替换。
    return str.replace(reg, "/");
}

// 注册信息点触碰、移开、点击事件 
// content 标记的文字信息  
// marker 标记对象 
// dataId 标记对象对应的id
// IsDiseasePoint 是否是预警点
function addClickHandler(content, marker, data, IsDiseasePoint) {
    //鼠标触碰事件
    marker.addEventListener("mouseover", function (e) {
        //获取坐标
        var point = e.lnglat;
        //创建一个信息窗实例
        var markerInfoWin = new T.InfoWindow(content, { offset: new T.Point(0, -30) }); // 创建信息窗口对象
        map.openInfoWindow(markerInfoWin, point); //开启信息窗口
    }
    );
    //鼠标移开事件
    marker.addEventListener("mouseout", function (e) {
        //关闭信息窗
        map.closeInfoWindow();
    }
    );
    if (IsDiseasePoint == false) {  //点击标记展示设备信息
        //鼠标单击事件deviceInfoPoint
        marker.addEventListener("click",
            function (e) {
                clickOpenWindow(data);
                //将所有的输入错误去除
                $(".popover-content, .arrow").parent().popover('destroy');
            }
        );
    } else {
        //鼠标单击事件预警点
        marker.addEventListener("click",
            function (e) {
                clickOpenDiseaseWindow(data);

            }
        );
    }
}

// 点击marker打开设备信息窗口
function clickOpenWindow(data) {
    //将数据加载时窗口中
    var getForm = $("#DeviceInfoForm input,#DeviceInfoForm select");

    var num = 0;
    for (var item in data) {
        if (num < getForm.length - 1) {
            getForm[num].value = data[item];
            num++;
        }
    }

    //给隐藏域赋值
    $("#hiddenDeviceID").val(data["Id"]);

    //将图片预览窗口清空
    RestitutionShowWind("MarkerOLPic", "MarkerImgDivPic", "MarkerImgOutDivPic", "MarkerLiPic", "MarkerImgNearDivPic", "MarkerDefaultImgPic", "editImgIdPic", "#ShowImgModel");

    //通过id获取图片地址
    GetPicPathById(data["Id"]);

    //IsEnteringDataLegal = true;

    //监测点名称
    isLegalDeviceName = true;
    //经度
    isLegalLon = true;
    //纬度
    isLegalLat = true;
    //流量卡
    isLegalPhoneNum = true;
    $("#DeviceInfoModal").modal('show');
}

// 点击marker打开预警点信息窗口
function clickOpenDiseaseWindow(data) {

    //将数据加载时窗口中
    $("#MonitorName").val(data[0]);
    $("#MonitorLon").val(data[1]);
    $("#MonitorLat").val(data[2]);
    $("#Lon").val(data[3]);
    $("#Lat").val(data[4]);
    $("#WarningDirection").val(data[5]);
    $("#DiseaseMonitorType").val(data[6]);
    $("#WarningLevel").val(data[7]);
    $("#WarningTime").val(data[8]);

    $("#DiseaseInfoModal").modal('show');
}

// 每隔两分钟刷新一次加载在地图上面
function UpdateOneMinute() {
    if (isStartMonitoring) {  //如果开启，点击关闭
        $("#startMonitoring").find("span").attr({
            "class": "menu-item-spanf glyphicon glyphicon-star-empty",
            "title": "点击启动监测",
        }).tooltip("fixTitle");//.tooltip("show");
        clearInterval(interval);//停止
        clearInterval(interval1);//停止
        clearInterval(interval2);//停止


        isStartMonitoring = !isStartMonitoring;
        $("#startMonitoring").css("background-color", "green");  //改变背景颜色

        for (var i = 0; i < arrayObj.length; i++) {  //arrayObj记录了所有的检测设备的Marker
            var getUrl = arrayObj[i].getIcon().getIconUrl();//获取图标地址
            arrayObj[i].getIcon().setIconUrl(getUrl.substring(0, getUrl.lastIndexOf('.')) + '.png')  //更改图标，将gif动态图，更改为不动的png图片
        }

    } else {
        $("#startMonitoring").find("span").attr({
            "class": "menu-item-spanf glyphicon glyphicon-star",
            "title": "点击关闭监测",
        }).tooltip("fixTitle");//.tooltip("show");

        // interval = setInterval(SetIntervalFunc, 120000);  //每隔2分钟，读取一次数据库，获取需要展示的监测结果
        interval = setInterval(SetIntervalFunc, 10000);  // 测试版本 setinterval：每隔10 s
        isStartMonitoring = !isStartMonitoring;

        interval1 = setInterval(function () {
            $("#startMonitoring").css("background-color", "red");
        }, 400);  //红色背景每0.4秒变动一次
        interval2 = setInterval(function () {
            $("#startMonitoring").css("background-color", "green");
        }, 1000);   //绿色背景每1秒变动一次，达到闪动的效果

        for (var i = 0; i < arrayObj.length; i++) {
            var getUrl = arrayObj[i].getIcon().getIconUrl();//获取图标地址
            arrayObj[i].getIcon().setIconUrl(getUrl.substring(0, getUrl.lastIndexOf('.')) + '.gif');
        }
    }

}


function SetIntervalFunc() {
    $("#RemoveWarningPointBtn").click();    // 先清空所有预警点、然后再添加后台获取到的

    var urlString = "/Home/GetDiseaseInfo";
    // 正式版：获取当前时间戳
    //var timestamp = Math.round(new Date() / 1000);
    //var NowTime = getFormatDate(timestamp);
    //timestamp = timestamp - 120;//查询数据库时，NowTime是当前时间， BeforeTime是当前时间减去120秒 间隔了两分钟
    //var BeforeTime = getFormatDate(timestamp);

    // 测试版：时间 每次刷新从 2017-12-05-00:00:00 开始
    var BeforeTime = getFormatDate(testTImeStamp);
    testTImeStamp = testTImeStamp + 120;
    var NowTime = getFormatDate(testTImeStamp);

    var array = $("#searchSelect option:not(:selected)");
    array.push($("#searchSelect option:selected")[0]);
    for (var i = 0; i < array.length; i++) {
        $.ajax({
            url: urlString,
            type: "Get",
            dataType: "Json",
            data: {
                arrayId: array[i].value,
                beforeTime: BeforeTime,
                endTime: NowTime
            },
            success: function (result) {

                var tmpjsonOb = eval("(" + result + ")");
                var appendStr = ""; // 添加进入表
                var DataArray = []; // 将预警点信息格式化存入数组

                $.each(tmpjsonOb, function (i, tmpItem) {
                    //不加载等级为0的预警点
                    if (tmpjsonOb[i]["Grade"] != 0) {
                        var item = tmpjsonOb[i];
                        appendStr += "<tr><td>";
                        for (j in tmpjsonOb[i]) {
                            if (j == "ArrayID") {
                                // ArrayID  要换成对应的中文， 用到一个全局的                      
                                for (tmpj in OptionsDict) {
                                    if (OptionsDict[tmpj].value == tmpjsonOb[i][j]) {
                                        DataArray.push(tmpjsonOb[i][j]);
                                        appendStr += OptionsDict[tmpj].Key + "</td><td>";
                                    }
                                }
                            } else {
                                DataArray.push(tmpjsonOb[i][j]);
                                appendStr += tmpjsonOb[i][j] + "</td><td>";
                            }
                        }
                        // 添加此预警点到地图上面
                        AddWarningPointToMap(DataArray, true);
                        appendStr = appendStr.slice(0, appendStr.length - 4);
                        appendStr += "</tr>";
                    }
                });
                // 将返回回来的数据添加进表格显示
                $("#SearchDiseaseInfoTable").append(appendStr);
                BindClickRow();
            },
            error: function (xhr, status, error) {
                //alert(status + "," + error);
                swal({
                    title: status + "," + error,
                    type: "error",
                    timer: 1500
                });
            }
        });
    }
}

// 根据时间戳获取格式化日期
function getFormatDate(timestamp) {
    timestamp = parseInt(timestamp + '000');
    var newDate = new Date(timestamp);
    Date.prototype.format = function (format) {
        var date = {
            'M+': this.getMonth() + 1,
            'd+': this.getDate(),
            'h+': this.getHours(),
            'm+': this.getMinutes(),
            's+': this.getSeconds(),
            'q+': Math.floor((this.getMonth() + 3) / 3),
            'S+': this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
            }
        }
        return format;
    }
    return newDate.format('yyyy/MM/dd hh:mm:ss');
}

// 删除监测设备信息
// getHiddenId 表单数据
// select_option 关闭窗口的选择器 null表示是树状结构窗体中
function DeleteDeviceInfo(getHiddenId, select_option) {
    //判断是否登录
    if (isLog == true) {
        Delete(function () {

            $.ajax({
                url: "/Home/DeleteDeviceById",
                type: "POST",
                data: { id: getHiddenId },
                success: function (Backdata) {
                    if (Backdata > 0) {
                        swal({
                            title: "删除成功！",
                            type: "success",
                            timer: 1500
                        });

                        if (select_option != null) {
                            //关闭窗口
                            $(select_option).click();
                        } else {
                            //表示是树状结构中的保存操作，需要刷新树状结构中的数据
                            $.ajax({
                                url: "/Home/GetTreeJson",
                                type: "POST",
                                success: function (backData) {
                                    //像树状结构中添加数据
                                    AddDataToTree(backData);
                                }
                            });
                        }

                        //刷新
                        $("#showDevice").click();
                        $("#showDevice").click();
                        //清空窗体数据
                        $("input[type=reset]").trigger("click");
                        //将下拉框设置为空
                        $("#treeSelectId")[0].value = ''
                        //表示是树状结构中的保存操作 需要将文本框变成不可编辑状态
                        if (select_option == null) {
                            //使得"浏览设备信息"窗口的文本框不可编辑
                            $("#TreeDeviceInfoForm input, #TreeDeviceInfoForm select").attr("disabled", true);
                        }
                        //将预览图片的位置重置
                        RestitutionShowWind("TreeMarkerOLPic", "TreeMarkerImgDivPic", "TreeMarkerImgOutDivPic", "TreeMarkerLiPic", "TreeMarkerImgNearDivPic", "TreeMarkerDefaultImgPic", "editImgIdPic", "#ShowImgModel");
                    }
                    else {
                        swal({
                            title: "删除失败！",
                            type: "error",
                            timer: 1500
                        });
                    }
                }
            });
        });
    } else {
        swal({
            title: "请先登录！",
            type: "warning",
            timer: 1500
        });
        openLoginModal();
    }
}


// 显示设备标记
function ShowDevice(getID) {
    //当地图加载时将设备信息已标记的形式在地图上显示
    //存取数据的数组
    var data_info = [];
    $.ajax({
        url: "/Home/GetAllDevicePoints",
        type: "post",
        datatype: "Json",
        success: function (BackData) {
            //将string转换成json
            var newData = JSON.parse(BackData);
            $.each(newData, function (index, element) {
                //js中二维数组必须进行重复的声明，否则会undefind  
                data_info[index] = [];
                data_info[index]["DeviceName"] = element.DeviceName;
                data_info[index]["MonitorType"] = element.MonitorType;
                data_info[index]["PhoneNum"] = element.PhoneNum;
                data_info[index]["ShuCaiNum"] = element.ShuCaiNum;
                data_info[index]["SensorNum"] = element.SensorNum;
                data_info[index]["YaoshiNum"] = element.YaoshiNum;
                data_info[index]["DeviceLon"] = element.DeviceLon;
                data_info[index]["DeviceLat"] = element.DeviceLat;
                data_info[index]["Beizhu"] = element.Beizhu;
                data_info[index]["Id"] = element.Id;
                data_info[index]["MonitorName"] = element.MonitorName;
                data_info[index]["MonitorPointInfoId"] = element.MonitorPointInfoId;
                data_info[index]["PointPicture"] = element.PointPicture;
                data_info[index]["content"] = "监测点:" + element.DeviceName + "<br>" + "通信流量卡：" + element.PhoneNum + "<br>" + "监测类型:" + element.MonitorType;
            });
            var imageType = '';
            if (isStartMonitoring) {  //如果开启了监测，使用gif图片,否则使用png图片
                imageType = 'gif';
            } else {
                imageType = 'png';
            }
            arrayObj = [];
            //添加标记
            for (var j = 0; j < data_info.length; j++) {
                var icon = null;
                if (data_info[j]["MonitorType"] == "泥石流") {
                    //创建图片对象
                    icon = new T.Icon({
                        iconUrl: "../../Resource/Img/mud/0." + imageType,
                        iconSize: new T.Point(20, 30),//30, 37)  45, 60
                        iconAnchor: new T.Point(10, 30)
                    });
                } else {
                    //创建图片对象
                    icon = new T.Icon({
                        iconUrl: "../../Resource/Img/coast/0." + imageType,
                        iconSize: new T.Point(20, 30),
                        iconAnchor: new T.Point(10, 30)//(15, 37)  22, 60
                    });
                }

                //不为空时，是经过搜索查出来的  
                if (getID != null) {

                    if (data_info[j]["Id"] == getID) {
                        // 创建标注
                        var marker = new T.Marker(new T.LngLat(data_info[j]["DeviceLon"], data_info[j]["DeviceLat"]), { icon: icon });

                        //获取标记文本
                        var content = data_info[j]["content"];
                        // 将标注添加到地图中
                        map.addOverLay(marker);
                        //注册标记的鼠标触摸,移开事件           
                        addClickHandler(content, marker, data_info[j], false);
                        SelectDevice.push(marker);
                        return;
                    }
                } else {     //为空是点击“显示监测点”按钮
                    // 创建标注
                    var marker = new T.Marker(new T.LngLat(data_info[j]["DeviceLon"], data_info[j]["DeviceLat"]), { icon: icon });
                    //获取标记文本
                    var content = data_info[j]["content"];
                    //将标注添加至数组
                    arrayObj.push(marker);
                    // 将标注添加到地图中
                    map.addOverLay(marker);
                    //注册标记的鼠标触摸,移开事件           
                    addClickHandler(content, marker, data_info[j], false);
                }
            }
            // var markers = new T.MarkerClusterer(map, { markers: arrayObj });
            //newArray = arrayObj;
            //聚合marker
            //markers = new T.MarkerClusterer(map, { markers: arrayObj });
            //设置网格大小
            //markers.setGridSize(5);
            //以下代码是为了获得不重复的阵列id
            var num = [];
            num[0] = 0;
            for (var i = 0; i < data_info.length; i++) {
                var exit = false;
                for (var j = 0; j < group_id.length; j++) {
                    if (group_id[j] == data_info[i]["MonitorPointInfoId"]) {
                        exit = true;
                        break;
                    }
                }
                if (exit == false) {
                    group_id[num[0]] = data_info[i]["MonitorPointInfoId"];
                    num[0]++;
                }
            }
            DrawLineForGroup();
        }
    });
}

// 删测设备 or 阵列的树 修改时间：2019。04.13
function GetDeleteTree() {
    $.ajax({
        url: "/Home/GetDeleteTreeJson",
        type: "post",
        datatype: "Json",
        success: function (BackData) {
            var defaultData = JSON.parse(BackData);;

            $('#treeview-checkable').treeview({
                data: defaultData,
                showIcon: false,
                showCheckbox: false,
                selectedBackColor: "#DC143C",
                multiSelect: true,
                levels: 1,
                onNodeChecked: function (event, node) {
                    $('#checkable-output').prepend('<p>' + node.text + ' was checked</p>');
                },
                onNodeUnchecked: function (event, node) {
                    $('#checkable-output').prepend('<p>' + node.text + ' was unchecked</p>');
                }
            });
        }
    });
}

// 为阵列画线
function DrawLineForGroup() {
    for (var i = 0; i < group_id.length; i++) {
        var first_point = [];
        var points1 = [];
        linesArray = [];
        $.ajax({
            url: "/Home/GetDeviceInfoByMonitorId",
            type: "post",
            datatype: "Json",
            data: { id: group_id[i] },
            success: function (BackData) {
                var newData = JSON.parse(BackData);
                $.each(newData, function (index, element) {
                    if (index == 0) {
                        first_point[0] = element.DeviceLon;
                        first_point[1] = element.DeviceLat;
                    }
                    points1.push(new T.LngLat(element.DeviceLon, element.DeviceLat));
                });
                points1.push(new T.LngLat(first_point[0], first_point[1]));
                line3 = new T.Polyline(points1);
                //向地图上添加线
                map.addOverLay(line3);
                points1 = [];
                first_point = [];
                linesArray.push(line3);
            }
        })
    }

}

// 保存设备信息
// getData 表单数据
// select_option 关闭窗口的选择器
function SavaDevideInfo(getData, select_option) {
    //判断是否登录
    if (isLog == true) {
        if (isLegalDeviceName == true && isLegalLon == true && isLegalLat == true && isLegalPhoneNum == true) {
            save(function () {

                var objectData = {
                    Id: getData[9].value,
                    DeviceName: getData[0].value,
                    ShuCaiNum: getData[3].value,
                    SensorNum: getData[4].value,
                    PhoneNum: getData[2].value,
                    YaoshiNum: getData[5].value,
                    DeviceLon: getData[6].value,
                    DeviceLat: getData[7].value,
                    Beizhu: getData[8].value,
                    MonitorType: getData[1].value,
                    MonitorName: getData[10].value,
                    MonitorPointInfoId: getData[11].value,
                    PointPicture: getData[12].value,
                };
                $.ajax({
                    url: "/Home/SaveDevice",
                    type: "POST",
                    data: objectData,
                    success: function (Backdata) {
                        if (Backdata == "True") {
                            swal({
                                title: "保存成功！",
                                type: "success",
                                timer: 1500
                            });
                            if (select_option != null) {
                                //关闭窗口
                                $(select_option).click();
                            } else {
                                //表示是树状结构中的保存操作，需要刷新树状结构中的数据
                                $.ajax({
                                    url: "/Home/GetTreeJson",
                                    type: "POST",
                                    success: function (backData) {
                                        //像树状结构中添加数据
                                        AddDataToTree(backData);
                                    }
                                });
                            }

                            //清空窗体数据
                            $("input[type=reset]").trigger("click");
                            //将下拉框设置为空
                            $("#treeSelectId")[0].value = ''
                            //表示是树状结构中的保存操作 需要将文本框变成不可编辑状态
                            if (select_option == null) {
                                //使得"浏览设备信息"窗口的文本框不可编辑
                                $("#TreeDeviceInfoForm input, #TreeDeviceInfoForm select").attr("disabled", true);
                            }

                            //刷新
                            $("#showDevice").click();
                            $("#showDevice").click();

                            //将预览图片的位置重置
                            RestitutionShowWind("TreeMarkerOLPic", "TreeMarkerImgDivPic", "TreeMarkerImgOutDivPic", "TreeMarkerLiPic", "TreeMarkerImgNearDivPic", "TreeMarkerDefaultImgPic", "editImgIdPic", "#ShowImgModel");
                            //将更新图片的隐藏域清空
                            $("#hidShowImgId").val("");
                        }
                        else {
                            swal({
                                title: "保存失败！",
                                type: "error",
                                timer: 1500
                            });
                        }
                    }
                });
            });
        } else {
            swal({
                title: "请检查数据格式！",
                type: "warning",
                timer: 1500
            });
        }
    } else {
        swal({
            title: "请先登录！",
            type: "warning",
            timer: 1500
        });
        openLoginModal();
    }
}
//卫星图
function layerToImg() {
    if (Terlayer == true) {
        map.removeLayer(lay2);
        map.removeLayer(textlay);
        Terlayer = false;
    }
    if (Imglayer == false) {
        map.addLayer(lay);
        map.addLayer(textlay);
        Imglayer = true;
    }
}
//小地图卫星图
function layerToImg1() {
    if (Terlayer1 == true) {
        map1.removeLayer(slay2);
        map1.removeLayer(stextlay);
        Terlayer1 = false;
    }
    if (Imglayer1 == false) {
        map1.addLayer(slay);
        map1.addLayer(stextlay);
        Imglayer1 = true;
    }
}
//地形图
function layerToTer() {
    if (Imglayer == true) {
        map.removeLayer(lay);
        map.removeLayer(textlay);
        Imglayer = false;
    }
    if (Terlayer == false) {
        map.addLayer(lay2);
        map.addLayer(textlay);
        Terlayer = true;
    }
}
//小地图地形图
function layerToTer1() {
    if (Imglayer1 == true) {
        map1.removeLayer(slay);
        map1.removeLayer(stextlay);
        Imglayer1 = false;
    }
    if (Terlayer1 == false) {
        map1.addLayer(slay2);
        map1.addLayer(stextlay);
        Terlayer1 = true;
    }
}
//原始图
function layerToOri() {
    if (Terlayer == true) {
        map.removeLayer(lay2);
        map.removeLayer(textlay);
        Terlayer = false;
    }
    if (Imglayer == true) {
        map.removeLayer(lay);
        map.removeLayer(textlay);
        Imglayer = false;
    }
}
//小地图原始图
function layerToOri1() {
    if (Terlayer1 == true) {
        map1.removeLayer(slay2);
        map1.removeLayer(stextlay);
        Terlayer1 = false;
    }
    if (Imglayer1 == true) {
        map1.removeLayer(slay);
        map1.removeLayer(stextlay);
        Imglayer1 = false;
    }
}
//删除提示框
function Delete(Func) {
    swal({
        title: "您确定要删除这条数据吗",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定删除！",
        cancelButtonText: "取消",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {
                Func();
            }
            else {
                swal({
                    title: "已取消",
                    type: "success",
                    timer: 1500
                })
            }
        }
    )
}

//保存提示框
function save(Func) {
    swal({
        title: "您确定要保存吗",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#6CE26C",
        confirmButtonText: "确定保存！",
        cancelButtonText: "取消",
        closeOnConfirm: false,
        closeOnCancel: false
    },
             function (isConfirm) {
                 if (isConfirm) {
                     Func();
                 }
                 else {
                     swal({
                         title: "已取消",
                         type: "success",
                         timer: 1500
                     })
                 }
             }
         )
}

//录入提示框
function EnteringData(Func) {
    swal({
        title: "您确定要录入吗",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#6CE26C",
        confirmButtonText: "确定录入！",
        cancelButtonText: "取消",
        closeOnConfirm: false,
        closeOnCancel: false
    },
             function (isConfirm) {
                 if (isConfirm) {
                     Func();
                 }
                 else {
                     swal({
                         title: "已取消",
                         type: "success",
                         timer: 1500
                     })
                 }
             }
         )
}

//打开监测阵列信息录入窗口
function OpenEnteringMonitorInfo() {
    //打开窗体时，让监测阵列不合法 必须输入触动合法监测
    isLegalMonitorNum = false;
    //清空窗体数据
    $("input[type=reset]").trigger("click");
    $("#MonitorInfoModal").modal('show');
    //将所有的输入错误去除
    $(".popover-content, .arrow").parent().popover('destroy');
}

//打开监测设备信息录入窗口
function OpenEnteringDeviceInfo() {
    // 将地图置于关闭状态
    $("#GetPointByMap")[0].title = '在地图上取点';
    // 清空窗体数据
    $("input[type=reset]").trigger("click");
    // 将select清空，重新加载
    $("#DeviceSelect").html("");
    // 在打开窗口之前查询出所有的监测阵列
    $.ajax({
        url: "/Home/GetNewMonitorInfos",
        type: "POSt",
        success: function (getData) {
            // 将string转换成json
            var newData = JSON.parse(getData);
            // 给隐藏域添加MonitorPointInfoId
            $("#MonitorPointInfoId").val(newData[0].MonitorId);
            // 获取监测类型
            $("#MonitorType").html(newData[0].Type);


            $.each(newData, function (index, element) {
                $("#DeviceSelect").append("<option value='" + element.MonitorId + "'>" + element.Name + "</option>");
            });
        }
    });
    //将展示图片的窗口恢复原状
    RestitutionShowWind("MarkerOL", "MarkerImgDiv", "MarkerImgOutDiv", "MarkerLi", "MarkerImgNearDiv", "MarkerDefaultImg", "editImg", "#editImgModel");
    //IsEnteringDataLegal = true;
    isLegalDeviceName == true;
    isLegalLon == true;
    isLegalLat == true;
    isLegalPhoneNum == true;
    $("#EnteringDeviceInfoModal").modal('show');
}

//打开删除监测阵列的窗口
function OpenDeleteMonitorWinfo() {
    $.ajax({
        url: "/Home/GetAllMonitorPointInfo",
        type: "POSt",
        success: function (getdata) {

        }
    })
    $("#DeleteMonitorInfoModal").modal('show');
}


//打开tree详情管理监测设备
function OpenTreeDeviceWindow() {
    //将图片的位置重置
    RestitutionShowWind("TreeMarkerOLPic", "TreeMarkerImgDivPic", "TreeMarkerImgOutDivPic", "TreeMarkerLiPic", "TreeMarkerImgNearDivPic", "TreeMarkerDefaultImgPic", "editImgIdPic", "#ShowImgModel");

    ////将数据加载时窗口中，获取窗口表单  
    //var getForm = $("#TreeDeviceInfoForm input, #TreeDeviceInfoForm select");
    //for (var num = 0; num < getForm.length - 1; num++) {
    //    //将表单数据清空
    //    getForm[num].value = '';
    //}

    $.ajax({
        url: "/Home/GetTreeJson",
        type: "POST",
        success: function (backData) {
            //IsEnteringDataLegal = true;
            isLegalDeviceName == true;
            isLegalLon == true;
            isLegalLat == true;
            isLegalPhoneNum == true;
            $("#TreeDeviceInfoModal").modal('show');
            //像树状结构中添加数据
            AddDataToTree(backData);
            $("input[type=reset]").trigger("click");
            //将下拉框设置为空
            $("#treeSelectId")[0].value = ''
            //点击“浏览所有监测点信息时”当数据框不可编辑
            $("#TreeDeviceInfoForm input, #TreeDeviceInfoForm select").attr("disabled", true);
            //将更新图片的隐藏域清空
            $("#hidShowImgId").val("");
        }
    });

}

//录入监测阵列信息
function EnteringMonitorInfo() {
    //判断是否登录
    //判断是否是正整数
    var reg = /^\d*$/;
    if (isLog == true) {
        //判断是否输入
        if ($("input[name='MonitorId']").val().length > 0 && $("input[name='MonitorIdName']").val().length > 0) {
            //判断输入格式是否正确
            if (isLegalMonitorNum) {
                EnteringData(function () {
                    //获取表单数据
                    var getData = $("#MonitorInfoForm");

                    var objectData = {
                        MonitorId: getData[0]["MonitorId"].value,
                        Name: getData[0]["MonitorIdName"].value,
                        Type: getData[0]["MonitorType"].value
                    };
                    $.ajax({
                        url: "/Home/EnteringMonitorPointInfo",
                        type: "POST",
                        data: objectData,
                        success: function (Backdata) {
                            if (Backdata["state"] == true) {
                                swal({
                                    title: "录入成功！",
                                    type: "success",
                                    timer: 1500
                                });
                                //关闭窗口
                                $("#CloseMonitorInfo").click();

                            }
                            else {
                                swal({
                                    title: "录入失败！",
                                    type: "error",
                                    timer: 1500
                                });
                            }
                        }
                    });
                });
            } else {
                swal({
                    title: "请检查数据格式！",
                    type: "warning",
                    timer: 1500
                });
            }
        } else {
            swal({
                title: "请填写必填项！",
                type: "warning",
                timer: 1500
            });
        }
    } else {
        swal({
            title: "请先登录！",
            type: "warning",
            timer: 1500
        });
        openLoginModal();
    }
}

//录入监测设备信息
function EnteringDeviceInfo() {
    //判断是否登录
    if (isLog == true) {
        if ($("#InputLontitude").val().length > 0 && $("#InputLatitude").val().length > 0 && $("#inputDeviceName").val().length > 0) {   //检查必填项是否填写
            if (isLegalDeviceName == true && isLegalLon == true && isLegalLat == true && isLegalPhoneNum == true) {  //判断输入数据是否合法
                EnteringData(function () {
                    //获取表单数据
                    var getData = $("#EnteringDeviceInfoForm");

                    var objectData = {
                        DeviceName: getData[0]["DeviceName"].value,
                        ShuCaiNum: getData[0]["ShuCaiNum"].value,
                        SensorNum: getData[0]["SensorNum"].value,
                        PhoneNum: getData[0]["PhoneNum"].value,
                        YaoshiNum: getData[0]["YaoshiNum"].value,
                        DeviceLon: getData[0]["DeviceLon"].value,
                        DeviceLat: getData[0]["DeviceLat"].value,
                        MonitorType: $("#MonitorType")[0].innerText,
                        MonitorName: getData[0]["MonitorName"].selectedOptions[0].innerText,
                        MonitorPointInfoId: $("#DeviceSelect")[0].options[$("#DeviceSelect")[0].selectedIndex].value,
                        Beizhu: getData[0]["Beizhu"].value
                    };
                    $.ajax({
                        url: "/Home/EnteringDeviceInfo",
                        type: "POST",
                        data: objectData,
                        success: function (Backdata) {
                            if (Backdata["state"] > 0) {
                                //获取新添加的监测设备的id
                                var getAddDeviceID = Backdata["state"];
                                $.ajax({
                                    url: "/Home/EnteringPics",
                                    type: "POST",
                                    data: { id: getAddDeviceID, imgPaths: $("#loadinImgPaths").val() },
                                    success: function (data) {
                                        if (data["state"] == true) {
                                            swal({
                                                title: "录入成功！",
                                                type: "success",
                                                timer: 1500
                                            });
                                            //关闭窗口
                                            $("#CloseEnteringDeviceInfo").click();
                                            //刷新
                                            $("#showDevice").click();
                                            $("#showDevice").click();
                                        }
                                        else {
                                            swal({
                                                title: "录入数据成功，录入图片失败！",
                                                type: "error",
                                                timer: 1500
                                            });
                                        }
                                    }
                                });

                            } else {
                                swal({
                                    title: "录入数据失败！",
                                    type: "error",
                                    timer: 1500
                                });
                            }
                        }
                    });
                });
            } else {
                swal({
                    title: "请检查数据格式！",
                    type: "warning",
                    timer: 1500
                });
            }
        } else {
            swal({
                title: "请填写必填项！",
                type: "warning",
                timer: 1500
            });
        }
    } else {
        swal({
            title: "请先登录！",
            type: "warning",
            timer: 1500
        });
        openLoginModal();
    }
}

//向树状结构中添加数据
function AddDataToTree(backData) {
    $('#tree').treeview({
        data: backData,   // data is not optional
        levels: 1,
        //点击节点
        onNodeSelected: function (event, data) {
            //data["tags"]  选中的ID
            if (data["tags"] >= 0) {
                $("#TreeDeviceInfoForm input, #TreeDeviceInfoForm select").attr("disabled", false);
                var data_info = [];
                $.ajax({
                    url: "/Home/GetOneDevice",
                    data: { id: data["tags"][0] },
                    type: "post",
                    datatype: "Json",
                    success: function (BackData) {
                        //将string转换成json
                        var newData = JSON.parse(BackData);
                        $.each(newData, function (index, element) {
                            data_info["DeviceName"] = element.DeviceName;
                            data_info["MonitorType"] = element.MonitorType;
                            data_info["PhoneNum"] = element.PhoneNum;
                            data_info["ShuCaiNum"] = element.ShuCaiNum;
                            data_info["SensorNum"] = element.SensorNum;
                            data_info["YaoshiNum"] = element.YaoshiNum;
                            data_info["DeviceLon"] = element.DeviceLon;
                            data_info["DeviceLat"] = element.DeviceLat;
                            data_info["Beizhu"] = element.Beizhu;
                            data_info["Id"] = element.Id;
                            data_info["MonitorName"] = element.MonitorName;
                            data_info["MonitorPointInfoId"] = element.MonitorPointInfoId;
                            data_info["PointPicture"] = element.PointPicture;
                        });
                        //将地图的中心移动至此标记点
                        var Lon = data_info["DeviceLon"];
                        var Lat = data_info["DeviceLat"];
                        if (!isShowDevice) {
                            $("#showDevice").click();
                        }
                        map.centerAndZoom(new T.LngLat(Lon, Lat), 25);
                        //触发标记的事件
                        //for (var i = 0; i < map.getPanes().markerPane.children.length; i++) {
                        //    map.getPanes().markerPane.children[i].mouseover();
                        //}

                        //将数据加载时窗口中，获取窗口表单
                        var getForm = $("#TreeDeviceInfoForm input, #TreeDeviceInfoForm select");
                        var num = 0;
                        //绑定数据
                        for (var item in data_info) {
                            if (num < getForm.length - 1) {
                                getForm[num].value = data_info[item];
                                num++;
                            }
                        }
                        //默认认为数据的格式正确
                        //IsEnteringDataLegal = true;
                        isLegalDeviceName == true;
                        isLegalLon == true;
                        isLegalLat == true;
                        isLegalPhoneNum == true;
                        //给隐藏域赋值
                        $("#TreehiddenDeviceID").val(data_info["Id"]);
                        $("#hidShowImgId").val(data_info["Id"]);
                        //加载图片
                        GetPicPathById(data_info["Id"]);
                        //将所有的输入错误去除
                        $(".popover-content, .arrow").parent().popover('destroy');
                    }
                });
            }
        }
    });
}

//绑定搜索栏改变事件
function BindVagueSelectInputChange() {

    $("#SearchText").on('input', function (e) {
        $("#TableBody").html("");
        $("#SearchResultContent").css("display", "block");
        $("#SearchResultContent").find("td").css("cursor", "pointer");
        var contentString = $("#SearchText").val();
        var StrTmp = "";
        if (contentString == "") {
            return;
        }
        //TableBody
        $.ajax({
            url: "/Home/GetVagueSearch",
            type: "POST",
            data: { SearchContent: contentString },
            success: function (backData) {
                var tmpObj = $.parseJSON(backData);
                $.each(tmpObj,
                    function (i, item) {
                        var signContent = contentString;
                        var signContentPosition = item.DeviceName.indexOf(signContent);
                        var beforeContent = item.DeviceName.slice(0, signContentPosition);
                        var backContent = item.DeviceName.slice(signContentPosition + signContent.length, item.DeviceName.length);
                        $("#TableBody").html("");
                        StrTmp += "<tr><td>" +
                            beforeContent + "<span class='biaozhu'>" + signContent + "</span>" + backContent +
                             "</td><td >" +
                            item.MonitorType +
                            "</td><td style = 'display:none'>" +
                            item.DeviceLon +
                            "</td><td style = 'display:none'>" +
                            item.DeviceLat +
                            "</td><td style = 'display:none'>" +
                            "监测点:" + item.DeviceName + "<br>" + "通信流量卡：" + item.PhoneNum + "<br>" + "监测类型:" + item.MonitorType +
                            "</td><td style = 'display:none'>" +
                            item.Id +
                            "</td ></tr>";
                    });
                $("#TableBody").append(StrTmp);
                BindVagueClickRow();
            }

        });
    });
}
//绑定清空查询
function BindClearVagueSelect() {
    $("#search_btn").click(function () {
        $("#SearchText").val("");
        $("#TableBody").html("");
        //隐藏表格
        $("#SearchResultContent").css("display", "none");

    });
}
//点击模糊查询出来的表格行
function BindVagueClickRow() {
    //给每行绑定了一个点击事件：var td = $( this ).find( "td" );
    $("#VagueTable tr").click(function () {
        var td = $(this).find("td");
        var Lon = td.eq(2).html();
        var Lat = td.eq(3).html();
        var type = td.eq(1).html();
        var content = td.eq(4).html();
        var DeviceID = td.eq(5).html();


        map.centerAndZoom(new T.LngLat(Lon, Lat), 20);
        var getLngLat = map.getCenter();
        //判断当前是否显示设备标记
        if (arrayObj.length <= 0) {
            ShowDevice(DeviceID);
        }
        //当用户点击行后，鼠标移开时隐藏搜索框
        $("#VagueTable tr").mouseout(function () {

            $('#search_btn').click();
        });
    });
}

//将展示图片的窗口恢复原状
//OlId         olId
//imgDivId     图片外层id
//imgOutDivId 最外层divID
//liId       li的id
//imgNearDivId   最近的divid
//defaultImgId  默认图片的id
function RestitutionShowWind(OlId, imgDivId, imgOutDivId, liId, imgNearDivId, defaultImgId, editImgId, showLoadingImgModel) {
    var newLi = document.createElement("li");
    newLi.setAttribute("id", liId);
    newLi.setAttribute("data-target", "#" + imgOutDivId);
    newLi.setAttribute("data-slide-to", 0);
    newLi.setAttribute("class", "active");

    //将li清空，并添加新的li
    var olObject = document.getElementById(OlId);
    olObject.innerHTML = "";
    olObject.appendChild(newLi);
    //    $(OlSelect).empty().append(newLi);



    var newDiv = document.createElement("div");
    //defaultImg
    newDiv.setAttribute("id", imgNearDivId);
    newDiv.setAttribute("class", "item active");

    var newImg = document.createElement("img");
    newImg.setAttribute("class", "d-block w-100 img-responsive img-rounded");
    newImg.setAttribute("src", "../../Resource/Img/uploadpic.png");
    newImg.setAttribute("alt", "First slide");
    newImg.setAttribute("css", 'width="600px" height="200px');

    newImg.setAttribute("id", defaultImgId)

    //将图片标签加入div中
    newDiv.appendChild(newImg);

    //"更新图片"图标
    var editImg = document.createElement("img");
    editImg.setAttribute("src", "../../Resource/Img/alert.png");
    //    editImg.setAttribute("class","glyphicon glyphicon-edit");
    editImg.setAttribute("alt", "editImg");
    editImg.setAttribute("style", "position:absolute;height:10%;right:0px;z-index:1000;top:0px;");
    editImg.setAttribute("title", "点击更新图片");
    editImg.setAttribute("id", editImgId);


    editImg.onclick = function () {
        if (isLog) {   //判断编辑图片时是否已经登录
            //判断是否是录入检测设备的model
            if (editImg.id == "editImg") {
                //加载之前将图片预览窗口清空
                RestitutionShowWind("MarkerOL", "MarkerImgDiv", "MarkerImgOutDiv", "MarkerLi", "MarkerImgNearDiv", "MarkerDefaultImg", "editImg", "#editImgModel");
                if (showLoadingImgModel == "#editImgModel") {
                    //获取隐藏域的图片路径
                    var getHiddenVal = $("#loadinImgPaths").val();
                    var PicData = getHiddenVal.split(';');
                    if (getHiddenVal.length == 0) {
                        PicData = new Array();
                    }

                    var array = [];
                    var keyslist = new Array();
                    $.each(PicData, function (index, item) {
                        keyslist[index] = {
                            key: item,
                            url: "/Home/Delete_Entering_Exist_imgs"  // 可修改 场景2中会用的  
                        };
                        array[index] = "<img class='file-preview-image'  src='../.." + item + "'>";
                    })
                    //将已经存在的图片加载至图框中 传递图片的<img >
                    edit_image_uploading(array, keyslist, 0);
                }
                $(showLoadingImgModel).modal('show');

            } else {
                if ($("#hidShowImgId").val()) {
                    $(showLoadingImgModel).modal('show');
                } else {

                }
            }

        } else {
            swal({
                title: "请先登录！",
                type: "warning",
                timer: 1500
            });
            openLoginModal();
        }


    }

    var divObject = document.getElementById(imgDivId);
    divObject.innerHTML = "";
    divObject.appendChild(newDiv);
    divObject.appendChild(editImg);
}

//图片上传处理
function LoadingImg() {

    $("#editImgFile").fileinput("refresh", {
        uploadUrl: '/Controllers/PicUpload.ashx', // you must set a valid URL here else you will get an error
        allowedFileExtensions: ['jpg', 'png', 'gif', 'jpeg'],
        overwriteInitial: false,
        language: 'zh', //设置语言
        maxFileSize: 10000,
        maxFilesNum: 10,
        showRemove: true,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        allowedFileTypes: ['jpg', 'png', 'gif', 'jpeg'],
        deleteUrl: '../Ashx/deleteUrl.ashx',   // String删除图片时的请求路径
        slugCallback: function (filename) {
            return filename.replace('(', '_').replace(']', '_');
        }
    });

    //	异步上传成功结果处理
    $("#editImgFile").on("fileuploaded", function (event, data, previewId, index) {
        //向隐藏域中添加数据
        hiddenPic = $("#loadinImgPaths").val();
        if (hiddenPic.length == 0) {
            $("#loadinImgPaths").val(data.response.msg);
        } else {
            $("#loadinImgPaths").val(hiddenPic + ";" + data.response.msg);
        }

    })
}

//获取cookie
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return unescape(arr[2]).toString();
    } else {
        return null;
    }
}

//通过循环加载图片窗口
function LoadPictureData(ImgDivselector, OlSelect, ImgOutDivSelect, imgNearDivId, data) {
    for (var i = 0; i < data.length; i++) {
        //加载服务器上的图片
        AddPicture(ImgDivselector, OlSelect, data[i], ImgOutDivSelect, imgNearDivId);
    }
}

//动态加载图片
//ImgDivselector 图片的最外层div  id
//OlSelect   指示标的ol  id
//PicPath   图片路径
//ImgOutDivSelect   图片预览的最外层div的id 确保li按钮的可用性
function AddPicture(ImgDivselector, OlSelect, PicPath, ImgOutDivSelect, imgNearDivId) {

    //获取li的个数
    var StrIndex = $(OlSelect)[0].childElementCount;


    var defaultImgPath = document.getElementById(imgNearDivId).children[0].src;
    var defaultImgName = defaultImgPath.substring(defaultImgPath.lastIndexOf("/") + 1);

    //查看默认实例图片
    if (defaultImgName == "uploadpic.png") {
        document.getElementById(imgNearDivId).children[0].src = PicPath;

    } else {
        var newDiv = $("<div class='item '></div>");
        //添加图片
        var myImg = document.createElement("img");
        myImg.setAttribute("class", "d-block w-100 img-responsive img-rounded");
        myImg.setAttribute("src", "../.." + PicPath);
        myImg.setAttribute("alt", StrIndex + 1 + " slide");
        myImg.setAttribute("name", StrIndex + "img");
        //将图片添加至div中
        newDiv.append(myImg);
        $(ImgDivselector).append(newDiv)

        //设置li
        var li = document.createElement("li");
        li.setAttribute("data-target", ImgOutDivSelect);
        li.setAttribute("data-slide-to", StrIndex);
        $(OlSelect).append(li);
    }

}


//隐藏上传图片的model时
function HidenLoadingImgModel() {
    //获取隐藏域的图片路径
    var getHiddenVal = $("#loadinImgPaths").val();
    //有上传图片时加载图片轮播
    if (getHiddenVal) {
        var PicData = getHiddenVal.split(';');
        LoadPictureData("#MarkerImgDiv", "#MarkerOL", "#MarkerImgOutDiv", "MarkerImgNearDiv", PicData);
    }

    //将上传图片位置清空
    $(".form-group .close.fileinput-remove").click();

}

//录入数据时，将已经存在的图片加载至图框中
function edit_image_uploading(editImgArray, keyslist, getDeviceId) {
    //更新图片
    $("#editImgFile").fileinput("refresh", {
        uploadUrl: '/Controllers/PicUpload.ashx',
        uploadExtraData: getDeviceId,
        allowedFileExtensions: ['jpg', 'png', 'gif', 'jpeg'],
        overwriteInitial: false,
        language: 'zh', //设置语言
        maxFileSize: 10000,
        maxFilesNum: 10,
        maxImageWidth: 100,
        maxImageHeight: 100,
        showRemove: false,
        showPreview: true,
        browseOnZoneClick: true,
        allowedFileTypes: ['jpg', 'png', 'gif', 'jpeg'],
        overwriteInitial: false,
        initialPreviewAsData: true,    //，是否将初始预览内容集解析为数据而不是原始标记
        initialPreview: editImgArray,
        initialPreviewConfig: keyslist,//配置预览中的一些参数   
        enctype: 'multipart/form-data',// 上传图片的设置  
        browseClass: "btn btn-primary" //按钮样式  
    });


    $("#editImgFile").on("filebeforedelete", function () {
        alert("asdf");
    });
    //删除成功后
    $("#editImgFile").on("filedeleted", function (event, data, previewId, index) {

        if (data.length > 0) {
            swal({
                title: "删除成功",
                type: "success",
                timer: 1000
            });
            var getHiddenVal = $("#loadinImgPaths").val();
            var PicData = getHiddenVal.split(';');
            var newVal = '';
            $.each(PicData, function (index, item) {
                if (data != item) {
                    newVal += item + ';';
                }
            })
            newVal = newVal.substring(0, newVal.length - 1)
            $("#loadinImgPaths").val(newVal)
        }
    });


    //异步上传成功结果处理
    $("#editImgFile").on("fileuploaded", function (event, data, previewId, index) {
        //向隐藏域中添加数据
        hiddenPic = $("#loadinImgPaths").val();
        if (hiddenPic.length == 0) {
            $("#loadinImgPaths").val(data.response.msg);
        } else {
            $("#loadinImgPaths").val(hiddenPic + ";" + data.response.msg);
        }
    });
}

//隐藏录入设备信息的model时
function HidenEnteringDeviceModel() {
    //应该将上传图片的窗口数据清空
    //将隐藏域的图片路径清空
    $("#loadinImgPaths").val("");

    //将上传图片位置清空
    $(".form-group .close.fileinput-remove").click();
    //将已经存在的图片加载至图框中 传递图片的<img >
    //edit_image_uploading(null, null, -1);
}

//通过id获取图片地址
function GetPicPathById(postId) {
    //将图片预览窗口清空
    RestitutionShowWind("MarkerOLPic", "MarkerImgDivPic", "MarkerImgOutDivPic", "MarkerLiPic", "MarkerImgNearDivPic", "MarkerDefaultImgPic", "editImgIdPic", "#ShowImgModel");

    RestitutionShowWind("TreeMarkerOLPic", "TreeMarkerImgDivPic", "TreeMarkerImgOutDivPic", "TreeMarkerLiPic", "TreeMarkerImgNearDivPic", "TreeMarkerDefaultImgPic", "editImgIdPic", "#ShowImgModel");
    //给上传图片的隐藏于赋值
    $("#hidShowImgId").val(postId);
    $.ajax({
        url: "/Home/GetPicPathById",
        type: "POST",
        data: { id: postId },
        success: function (backData) {
            //将string转换成json
            var newData = JSON.parse(backData);
            //json字符串转数组
            //var getArray = JSON.parse(newData);
            var array = [];
            var keyslist = new Array();
            $.each(newData, function (index, item) {
                //加载服务器上的图片
                AddPicture("#MarkerImgDivPic", "#MarkerOLPic", item.PicPath, "#MarkerImgOutDivPic", "MarkerImgNearDivPic");
                AddPicture("#TreeMarkerImgDivPic", "#TreeMarkerOLPic", item.PicPath, "#TreeMarkerImgOutDivPic", "TreeMarkerImgNearDivPic");
                keyslist[index] = {
                    key: item.Id,
                    url: "/Home/DeleteExistImgs"  // 可修改 场景2中会用的  
                };
                array[index] = "<img class='file-preview-image'  src='../.." + item.PicPath + "'>";

            });

            //获取监测设备的id
            var getDeviceId = { "DevieceID": postId };

            //将已经存在的图片加载至图框中 传递图片的<img >
            edit_image(array, keyslist, getDeviceId);

        }
    });
}


//将已经存在的图片加载至图框中
function edit_image(editImgArray, keyslist, getDeviceId) {
    //更新图片
    $("#ShowImgFile").fileinput("refresh", {
        uploadUrl: '/Controllers/PicUpload.ashx',
        uploadExtraData: getDeviceId,
        allowedFileExtensions: ['jpg', 'png', 'gif', 'jpeg'],
        overwriteInitial: false,
        language: 'zh', //设置语言
        maxFileSize: 10000,
        maxFilesNum: 10,
        maxImageWidth: 100,
        maxImageHeight: 100,
        showRemove: false,
        showPreview: true,
        browseOnZoneClick: true,
        allowedFileTypes: ['jpg', 'png', 'gif', 'jpeg'],
        overwriteInitial: false,
        initialPreviewAsData: true,    //，是否将初始预览内容集解析为数据而不是原始标记
        initialPreview: editImgArray,
        initialPreviewConfig: keyslist,//配置预览中的一些参数   
        enctype: 'multipart/form-data',// 上传图片的设置  
        browseClass: "btn btn-primary" //按钮样式  
    });


    $("#ShowImgFile").on("filebeforedelete", function () {
        alert("asdf");
    });
    //删除成功后
    $("#ShowImgFile").on("filedeleted", function () {
        swal({
            title: "删除成功",
            type: "success",
            timer: 1000
        });
    });


    //异步上传成功结果处理
    $("#ShowImgFile").on("fileuploaded", function (event, data, previewId, index) {
        if (data.response.msg.length > 0) {
            //到此只是文件上传本地成功,还未更新至数据库
            $.ajax({
                url: "/Home/editUploadImgs",
                type: "POST",
                data: { DevieceID: getDeviceId.DevieceID, path: data.response.msg },
                success: function (backData) {
                    if (backData.msg == true) {
                        swal({
                            title: "上传成功",
                            type: "success",
                            timer: 1000
                        });
                    } else {
                        swal({
                            title: "上传失败",
                            type: "error",
                            timer: 1000
                        });
                    }

                }
            });


        } else {
            swal({
                title: "上传失败",
                type: "error",
                timer: 1000
            });
        }
    });
}


//关闭更新图片的model
function HidenShowImgModel(getid) {
    //更新数据
    GetPicPathById(getid);
}

//判断是隐藏还是显示
function isShowOrHide() {
    setInterval(function () {
        if (SelectDevice.length > 0 || arrayObj.length > 0) {
            $("#showDevice").find("span").attr({
                "class": "menu-item-spanf glyphicon glyphicon-eye-close",
                "title": "隐藏地图上的监测点",
            }).tooltip("fixTitle");
            isShowDevice = true;
        }
    }, 1000);
}


//录入界面div的点击事件
function Divclick(thisDiv) {
    $(thisDiv).find('a')[0].click();
}

//录入信息的时候在地图上面取点
function BindGetPointByMap() {
    $("#GetPointByMap").click(function (ev) {
        if (this.title == '在地图上取点') {
            SecondaryMapDescribtion = "EnteringDataForm";       //录入Form
            ShowViceMap();
            $("#GetPointByMap")[0].title = '点击关闭';
        } else {
            //关闭副地图
            var oEvent = event || ev //ev || event;
            oEvent.cancelBubble = true;
            oEvent.stopPropagation();
            HideViceMap();
            $("#GetPointByMap")[0].title = '在地图上取点';
        }

    });
    $("#GetPointByMap1").click(function (ev) {
        zoomout();
        zoomin();
        if (this.title == '在地图上取点') {
            SecondaryMapDescribtion = "ClickPointDataForm";     //clickPointForm
            ShowViceMap();
            $("#GetPointByMap1")[0].title = '点击关闭';
        } else {
            //关闭副地图
            var oEvent = event || ev //ev || event;
            oEvent.cancelBubble = true;
            oEvent.stopPropagation();
            HideViceMap();
            $("#GetPointByMap1")[0].title = '在地图上取点';
        }

    });
    $("#GetPointByMap2").click(function () {
        if (this.title == '在地图上取点') {
            SecondaryMapDescribtion = "AllInfoDataForm";        //所有信息Form
            ShowViceMap();
            $("#GetPointByMap2")[0].title = '点击关闭';
        } else {
            //关闭副地图
            var oEvent = event || ev; //ev || event;
            oEvent.cancelBubble = true;
            oEvent.stopPropagation();
            HideViceMap();
            $("#GetPointByMap2")[0].title = '在地图上取点';
        }

    });
}

//出现副地图
function ShowViceMap() {
    $("#GetPointMapDiv").css('display', "block");
    var Lng;
    var Lat;
    if (SecondaryMapDescribtion == "ClickPointDataForm") {
        Lng = $("#ClickInputLontitude").val();
        Lat = $("#ClickInputLatitude").val();
        map1Marker.setLngLat(T.LngLat(Lng, Lat));
    } else if (SecondaryMapDescribtion == "AllInfoDataForm") {
        Lng = $("#AllInfoInputLontitude").val();
        Lat = $("#AllInfoInputLatitude").val();
        map1Marker.setLngLat(T.LngLat(Lng, Lat));
    }
}
//隐藏副地图
function HideViceMap() {
    $("#GetPointMapDiv").css('display', "none");
}

//通过移动marker来设置经纬度
function SetLnLatByDrag(e) {
    var point = e.target;
    if (SecondaryMapDescribtion == "EnteringDataForm") {
        $("#InputLontitude").val(point.getLngLat().lng);
        $("#InputLatitude").val(point.getLngLat().lat);
    } else if (SecondaryMapDescribtion == "ClickPointDataForm") {    //点击设备弹出的框框
        $("#ClickInputLontitude").val(point.getLngLat().lng);
        $("#ClickInputLatitude").val(point.getLngLat().lat);
    }
    else if (SecondaryMapDescribtion == "AllInfoDataForm") {
        $("#AllInfoInputLontitude").val(point.getLngLat().lng);
        $("#AllInfoInputLatitude").val(point.getLngLat().lat);
    }
}
//副地图点击事件
function Map1Click(e) {
    var Lng = e.lnglat.getLng();
    var Lat = e.lnglat.getLat();
    map1Marker.setLngLat(T.LngLat(Lng, Lat));
    if (SecondaryMapDescribtion == "EnteringDataForm") {
        $("#InputLontitude").val(Lng);
        $("#InputLatitude").val(Lat);
        $("#InputLontitude").blur();
        $("#InputLatitude").blur();
    }
    else if (SecondaryMapDescribtion == "ClickPointDataForm") {    //点击设备弹出的框框
        $("#ClickInputLontitude").val(Lng);
        $("#ClickInputLatitude").val(Lat);
        $("#ClickInputLontitude").blur();
        $("#ClickInputLatitude").blur();
    }
    else if (SecondaryMapDescribtion == "AllInfoDataForm") {
        $("#AllInfoInputLontitude").val(Lng);
        $("#AllInfoInputLatitude").val(Lat);
        $("#AllInfoInputLontitude").blur();
        $("#AllInfoInputLatitude").blur();
    }
}
//绑定经纬度两输入框的改变事件
function BindLngLatTextChange() {
    $("#InputLontitude").on('input', LngLatTextChange);
    $("#InputLatitude").on('input', LngLatTextChange);
    $("#ClickInputLontitude").on('input', LngLatTextChange);
    $("#ClickInputLatitude").on('input', LngLatTextChange);
    $("#AllInfoInputLontitude").on('input', LngLatTextChange);
    $("#AllInfoInputLatitude").on('input', LngLatTextChange);
}
//经纬度两输入框的改变事件
function LngLatTextChange() {
    var Lng;
    var Lat;
    if (SecondaryMapDescribtion == "EnteringDataForm") {
        Lng = $("#InputLontitude").val();
        Lat = $("#InputLatitude").val();
    } else if (SecondaryMapDescribtion == "ClickPointDataForm") {    //点击设备弹出的框框
        Lng = $("#ClickInputLontitude").val();
        Lat = $("#ClickInputLatitude").val();
    }
    else if (SecondaryMapDescribtion == "AllInfoDataForm") {
        Lng = $("#AllInfoInputLontitude").val();
        Lat = $("#AllInfoInputLatitude").val();
    }

    map1Marker.setLngLat(T.LngLat(Lng, Lat));
}



//判断是否正确输入 通信流量卡    现在已经移除该监测 如果需要 就只需在name="PhoneNum" 的标签中加上onblur="IsDataLegal_of_PhoneNum(this)"
function IsDataLegal_of_PhoneNum(tagObject) {
    //判断是否是正整数
    var reg = /^1[0-9]{10}$/;
    //获取标签上的value
    var str = tagObject.value;
    //判断是否满足正则
    if (reg.test(str) == false && str.length > 0) {
        $(tagObject).data("toogle", "right").data("placement", "right").data("container", $(tagObject).parent()).popover({ "trigger": "manual", "html": "true", "content": "<p ><font color='#fc4343'>请输入正确的通信流量卡</font></p>" }).popover("show");
        //一段时间后消失
        //var timer = setTimeout(function popoverTag() {
        //    $(tagObject).popover('destroy');
        //}, 1000);
        isLegalPhoneNum = false;
        return;
    }
    else {
        isLegalPhoneNum = true;
        $(tagObject).popover('destroy');
    }
}

//判断是否为空 监测点名称
function IsEmpty(tagObject) {
    //获取标签上的value
    var str = tagObject.value;
    if (str.length <= 0) {
        $(tagObject).data("toogle", "right").data("placement", "right").data("container", $(tagObject).parent()).popover({ "trigger": "manual", "html": "true", "content": "<p ><font color='#fc4343'>请输入监测点名称</font></p>" }).popover("show");
        isLegalDeviceName = false;
    } else {
        isLegalDeviceName = true;
        $(tagObject).popover('destroy');
    }
}

//判断是否是正整数 监测阵列编号
function IsNum(tagObject) {
    //判断是否是正整数
    var reg = /^\d*$/;
    //获取标签上的value
    var str = tagObject.value;
    //判断是否满足正则
    if (reg.test(str) == false) {
        $(tagObject).data("toogle", "right").data("placement", "right").data("container", $(tagObject).parent()).popover({ "trigger": "manual", "html": "true", "content": "<p ><font color='#fc4343'>请输入正确的编号</font></p>" }).popover("show");
        isLegalMonitorNum = false;
        return;
    }
    else {
        $(tagObject).popover('destroy');
        isLegalMonitorNum = true;
    }
}



//判断 土块面积 kg/亩 经纬度 是否合法
function IsDataLegal_of_lon(tagObject) {
    //判断非负数的正则表达式
    var reg = /^\d+(\.{0,1}\d+){0,1}$/;
    //获取标签上的value
    var str = tagObject.value;
    //判断是否满足正则
    if (reg.test(str) == false) {
        $(tagObject).data("toogle", "right").data("placement", "right").data("container", $(tagObject).parent()).popover({ "trigger": "manual", "html": "true", "content": "<p ><font color='#fc4343'>请输入正确的经纬度</font></p>" }).popover("show");
        //一段时间后消失
        var timer = setTimeout(function popoverTag() {
            $(tagObject).popover('destroy');
        }, 1000);
        isLegalLon = false;
        return;
    }
    else {
        isLegalLon = true;
        $(tagObject).popover('destroy');
    }
}

function IsDataLegal_of_lat(tagObject) {
    //判断非负数的正则表达式
    var reg = /^\d+(\.{0,1}\d+){0,1}$/;
    //获取标签上的value
    var str = tagObject.value;
    //判断是否满足正则
    if (reg.test(str) == false) {
        $(tagObject).data("toogle", "right").data("placement", "right").data("container", $(tagObject).parent()).popover({ "trigger": "manual", "html": "true", "content": "<p ><font color='#fc4343'>请输入正确的经纬度</font></p>" }).popover("show");
        //一段时间后消失
        var timer = setTimeout(function popoverTag() {
            $(tagObject).popover('destroy');
        }, 1000);
        isLegalLat = false;
        return;
    }
    else {
        isLegalLat = true;
        $(tagObject).popover('destroy');
    }
}


// 导出 Excel 功能
function ExportExcel() {
    $("#SearchDiseaseInfoTable").table2excel({
        exclude: ".noExl",
        name: "Excel Document Name",
        filename: "预警信息" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
        fileext: ".xls",
        exclude_img: true,
        exclude_links: true,
        exclude_inputs: true
    });
}