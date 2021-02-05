const app = getApp();
const MARKER_ICON_SELECT_PATH = "/images/map/signin_marker_select.png";
const MARKER_ICON_UNSELECT_PATH = "/images/map/signin_marker_unselect.png";
const MARKER_SIZE = "34px";
const CIRCLES_COLOR = "#1E9FFF";
const CIRCLES_FILL_COLOR = "#1E9FFF33";

import api from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openSetting: {
      title: "",
      content: "",
      show: false
    },
    locationError: {
      show: false
    },
    siteSelect: {
      texts: [],
      values: [],
      siteList: [],
      currentIndex: 0
    },
    mapData: {
      showData: true,
      scale: 14,
      range: 500,
      markers: [],
      circles: [],
      includePoints: []
    },
    signinData: {
      siteId: null,
      positionName: null,
      positionLng: null,
      positionLat: null,
      signInImgIds: "",
    },
    //文本
    signinText: {
      currentSiteName: "附近没有可签到站点",
      currentSiteDistance: "",
      signinStatus: false,
      signinRangeText: "未进入签到范围",
      currentDate: ""
    },
    signinForm: {
      show: false,
      signinDate: "",
      currentSiteName: "",
      signInImgList: [],
      signInImgIdList: []
    },
    userInfo: null,
    defaultShowData: true,
  },
  onLoad: function () {
    if (app.globalData.appConfig) {
      if (app.globalData.appConfig.signInRange){
        this.setData({
          "mapData.range": app.globalData.appConfig.signInRange
        });
      }
      if ( app.globalData.appConfig.signInMapShowData != undefined){
        this.setData({
          "defaultShowData": app.globalData.appConfig.signInMapShowData
        });
      }

    }
    this.initTimer();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userInfo: app.globalData.user_info || null
    });
    if (!this.data.signinForm.show){
      this.hideAllPage();
      this.refreshCurrentLocation();

    }
  },
  onSelectSiteConfirm(event) {
    var index = event.detail.value;
    this.selectSite(index);
  },
  onfreshLocation: function () {
    this.refreshCurrentLocation();
  },
  onHideSetting: function (e) {
    this.setData({
      "openSetting.show": false
    });
  },
  onOpenSetting: function (e) {
    var that = this;
    this.openSetting(function (res) {
      if (res.authSetting["scope.userLocation"]) {
        that.setData({
          "openSetting.show": false
        });
      }
    });
  },
  onHidelocationError: function (e) {
    this.setData({
      "locationError.show": false
    });
  },
  onMapMarkerTap: function (e) {
    var index = e.markerId;
    this.selectSite(index);
  },
  onMapRegionChange: function (e) {
    var that = this;
    if (e.type == "end" && e.causedBy == "scale") {

      var map = wx.createMapContext("map", this);
      map.getScale({
        success(res) {
          if (res.scale < 11) {
            that.setData({
              "mapData.showData": false
            });
          } else {
            that.setData({
              "mapData.showData": that.data.defaultShowData
            });
          }
        }
      });
    }
  },
  onOpenSigninPage: function () {
    this.openSigninPage();
  },
  onHideSigninPage: function () {
    this.hideSigninPage();
  },
  onViewImage(e) {
    wx.previewImage({
      urls: this.data.signinForm.signInImgList,
      current: e.currentTarget.dataset.url
    });
  },
  onChooseImage() {
    const that = this
    wx.chooseImage({
      count: this.data.signinForm.signInImgList.length < 1 ? 1 : 0, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], //从相册选择
      success: (res) => {
        wx.showLoading({
          mask: true,
          title: '拼命上传中....'
        })
        app.upload(res.tempFilePaths[0], app.baseurl+app.api.FU_SIGNIN)
          .then(uploadRes => {
            var result = uploadRes;
            if (result.code == 1) {
              this.data.signinForm.signInImgIdList.push(result.data.fileId);
              this.data.signinForm.signInImgList.push(res.tempFilePaths[0]);
              this.setData({
                "signinForm.signInImgIdList": this.data.signinForm.signInImgIdList,
                "signinForm.signInImgList": this.data.signinForm.signInImgList,
                "signinData.signInImgIds": this.data.signinForm.signInImgIdList.join(","),
              });

              wx.hideLoading({})
            }
          }).catch(err=>{
            wx.showToast({
              title: "上传失败",
              icon: 'none',
              duration: 2500
            })
          });
      }
    });
  },
  onDelImg(e) {
    wx.showModal({
      content: '确定要删除这张照片吗？',
      cancelText: '点错了',
      confirmText: '确定',
      confirmColor: '#0081ff',
      success: res => {
        if (res.confirm) {
          this.data.signinForm.signInImgIdList.splice(e.currentTarget.dataset.index, 1);
          this.data.signinForm.signInImgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            "signinForm.signInImgIdList": this.data.signinForm.signInImgIdList,
            "signinForm.signInImgList": this.data.signinForm.signInImgList,
            "signinData.signInImgIds": this.data.signinForm.signInImgIdList.join(","),
          });
        }
      }
    })
  },
  onSignin: function () {
    this.signin();
  },

  //刷新当前位置
  refreshCurrentLocation: function (callback) {
    var that = this;
    // this.setData({
    //   "siteSelect.currentIndex": 0
    // });
    wx.showLoading({
      mask: true,
      title: '拼命加载中....'
    });
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy: true,
      success(res) {
        that.refreshSiteList(res.longitude, res.latitude, callback);
      },
      fail(res) {
        if (res.errMsg.includes("fail auth deny")) {
          //未授权
          that.openSettingPage();
        } else if (res.errCode == 2) {
          //定位服务未开启
          that.openLocationErrorPage("定位服务未开启", "请在打开手机定位功能，并且在“设置->应用权限”中打开微信位置权限，方便为您提供站点签到功能");
        } else {
          //定位服务获取失败
          that.openLocationErrorPage("位置获取失败", "无法获取当前位置，msg：" + res.errMsg + "，请联系管理员");
        }
        that.refreshMapData(null, null, []);
        wx.hideLoading();
        if (callback) {
          callback({
            gpsStatus: false
          });
        }
      },
    });
  },
  //刷新站点列表
  refreshSiteList: function (lng, lat, callback) {
    var that = this;
    app.request({
      url: app.api.SIGNIN_NEARBY_SITE,
      data: {
        positionLng: lng,
        positionLat: lat
      }
    }).then(res => {
      if (res.data.code == 1) {
        that.setData({
          "signinData.positionName": res.data.data.currentPosition.positionName,
          "mapData.range": res.data.data.range
        });
        that.refreshMapData(
          res.data.data.currentPosition.positionLng,
          res.data.data.currentPosition.positionLat,
          res.data.data.nearbySiteInfos);
        if (callback) {
          callback({
            gpsStatus: true
          });

        }
      }

    });
  },
  refreshMapData: function (lng, lat, siteList) {
    //设置中心位置
    //设置点位
    //设置范围
    var markers = [];
    var circles = [];
    var currentIndex = 0;
    var includePoints = [{
      latitude: lat,
      longitude: lng
    }];
    var siteSelect = {
      texts: [],
      values: [],
      siteList: []
    }
    for (var index in siteList) {
      var site = siteList[index];
      var iconPath = MARKER_ICON_UNSELECT_PATH;
      var display = "BYCLICK";
      if (site.id == this.data.signinData.siteId){
        //缓存的已选站点，否则选中第一个
        currentIndex = index;
        iconPath = MARKER_ICON_SELECT_PATH;
        display = "ALWAYS";
      }
      markers.push({
        id: index,
        latitude: site.positionLat,
        longitude: site.positionLng,
        title: site.name,
        iconPath: iconPath,
        width: MARKER_SIZE,
        height: MARKER_SIZE,
        rotate: 0,
        alpha: 1,
        callout: {
          content: site.name,
          padding: 10,
          borderRadius: 2,
          display: display
        }
      });
      circles.push({
        latitude: site.positionLat,
        longitude: site.positionLng,
        color: CIRCLES_COLOR,
        fillColor: CIRCLES_FILL_COLOR,
        radius: this.data.mapData.range,
        strokeWidth: 1
      });
      includePoints.push({
        latitude: site.positionLat,
        longitude: site.positionLng,
      });
      siteSelect.texts.push(site.name);
      siteSelect.values.push(site.id);
    }
    
    siteSelect.siteList = siteList;
    var data = {
      "mapData.currentLng": lng,
      "mapData.currentLat": lat,
      "siteSelect.texts": siteSelect.texts,
      "siteSelect.values": siteSelect.values,
      "siteSelect.siteList": siteSelect.siteList,
      "signinData.positionLng": lng,
      "signinData.positionLat": lat,
      "mapData.scale": this.data.mapData.scale,
      "mapData.showData": this.data.defaultShowData
    };
    if (markers.length > 0){
      
      markers[currentIndex].iconPath = MARKER_ICON_SELECT_PATH;
      markers[currentIndex].callout.display = "ALWAYS";
    }
    data["mapData.markers"] = markers;
    data["mapData.circles"] = circles;
    data["siteSelect.currentIndex"]= currentIndex;
    if (siteList.length >= 1) {
      data["signinText.currentSiteName"] = siteList[currentIndex].name;
      data["signinText.currentSiteDistance"] = "距离" + siteList[currentIndex].distanceNote;
      data["signinText.signinStatus"] = true;
      data["signinText.signinRangeText"] = siteList[currentIndex].name;
      data["signinData.siteId"] = siteList[currentIndex].id;
    } else {
      data["signinText.currentSiteName"] = "附近没有可签到的站点";
      data["signinText.signinStatus"] = false;
      data["signinText.signinRangeText"] = "未进入签到范围";
      data["signinText.currentSiteDistance"] = "";
      data["signinData.siteId"] = null;
    }
    this.setData(data);
  },
  initTimer: function () {
    var that = this;
    return setInterval(function () {
      that.setData({
        "signinText.currentDate": getCurrentDate()
      });
    }, 1000);
  },
  openSetting: function (callback) {
    wx.openSetting({
      success(res) {
        if (callback) {
          callback(res)

        }
      }
    });

  },
  openSettingPage: function () {
    this.setData({
      "openSetting.show": true
    });
  },
  openLocationErrorPage: function (title, content) {
    this.setData({
      "locationError.show": true,
      "locationError.title": title,
      "locationError.content": content
    });
  },
  selectSite: function (index) {
    var data = {
      "signinText.currentSiteName": this.data.siteSelect.siteList[index].name,
      "signinText.currentSiteDistance": "距离" + this.data.siteSelect.siteList[index].distanceNote,
      "signinData.siteId": this.data.siteSelect.values[index],
      "siteSelect.currentIndex": index,
      "signinText.signinRangeText": this.data.siteSelect.siteList[index].name,
    };
    for (var i in this.data.mapData.markers) {
      if (i == index) {
        data["mapData.markers[" + i + "].iconPath"] = MARKER_ICON_SELECT_PATH;
        data["mapData.markers[" + i + "].callout.display"] = "ALWAYS";
      } else {
        data["mapData.markers[" + i + "].iconPath"] = MARKER_ICON_UNSELECT_PATH;
        data["mapData.markers[" + i + "].callout.display"] = "BYCLICK";
      }
    }
    this.setData(data);
  },
  signin: function () {
    //签到，获取当前位置，发送签到数据
    var that = this;
    //缓存原始数据
    var signinData = JSON.parse(JSON.stringify(this.data.signinData));
    if (!that.data.signinData.signInImgIds.length) {
      wx.showModal({
        title: '提示',
        content: '请上传现场照片',
        showCancel: false,
        confirmColor: '#0081ff',
      });
      return;
    }
    this.refreshCurrentLocation(function (result) {
      //提交
      if (!that.data.signinText.signinStatus) {
        that.setData({
          "signinForm.show": false
        });
        if (result.gpsStatus) {
          wx.showModal({
            title: '提示',
            content: '提交失败，当前位置附近没有可签到站点',
            confirmColor: '#0081ff',
            showCancel: false
          });

        }
      } else {
        //数据校验
        if (!(that.data.signinData.siteId &&
            that.data.signinData.positionName &&
            that.data.signinData.positionLng &&
            that.data.signinData.positionLat)) {
          wx.showModal({
            title: '提示',
            content: '提交失败，无法获取当前位置信息',
            confirmColor: '#0081ff',
            showCancel: false,
            success: function () {
              that.setData({
                "signinForm.show": false
              });
            }
          });
        } else{
          if (signinData.siteId != that.data.signinData.siteId 
            || signinData.positionName != that.data.signinData.positionName){
            //位置发生变化
            wx.showModal({
              title: '提示',
              content: '当前位置发生改变请重新确认',
              confirmColor: '#0081ff',
              showCancel: false,
              success: function(){
                that.setData({
                  "signinForm.signinDate": getCurrentDate(),
                  "signinForm.currentSiteName": that.data.signinText.currentSiteName,
                });
              }
            });
            return;
          }
          app.request({
            url: app.api.SIGNIN,
            data: that.data.signinData
          }).then(res => {
            if (res.data.code == 1) {
              that.setData({
                "signinForm.show": false,
                "signinForm.signInImgIdList": [],
                "signinForm.signInImgList": [],
                "signinData.signInImgIds": "",
              });
              wx.showModal({
                title: '提示',
                content: '签到成功',
                confirmColor: '#0081ff',
                showCancel: false,
                success: function(){
                  that.refreshCurrentLocation();
                }
              });
            }
      
          });
        }
        //提交数据

      }
    });
  },
  openSigninPage: function () {
    //打开签到表单页面，需要实现图片上传
    if (this.data.signinText.signinStatus) {
      if (this.data.siteSelect.siteList[this.data.siteSelect.currentIndex].todaySigninStatus){
        wx.showModal({
          title: '提示',
          content: '今日已签到，确定要再次签到吗？',
          confirmColor: '#0081ff',
          cancelText: '取消',
          confirmText: '确定',
          success: res => {
            if (res.confirm) {
              var that = this;
              this.refreshCurrentLocation(function (result) {
                if (!that.data.signinText.signinStatus) {
                  if (result.gpsStatus) {
                    wx.showModal({
                      title: '提示',
                      content: '当前位置附近没有可签到站点',
                      confirmColor: '#0081ff',
                      showCancel: false
                    });
                    return;
                  }
                }else{
                  
                  that.setData({
                    "signinForm.show": true,
                    "signinForm.signinDate": getCurrentDate(),
                    "signinForm.currentSiteName": that.data.signinText.currentSiteName,
                  });
                }
              });
              
            }
          }
        })
      }else{
        
        var that = this;
        this.refreshCurrentLocation(function (result) {
          if (!that.data.signinText.signinStatus) {
            if (result.gpsStatus) {
              wx.showModal({
                title: '提示',
                content: '当前位置附近没有可签到站点',
                confirmColor: '#0081ff',
                showCancel: false
              });
              return;
            }
          }else{
            
            that.setData({
              "signinForm.show": true,
              "signinForm.signinDate": getCurrentDate(),
              "signinForm.currentSiteName": that.data.signinText.currentSiteName,
            });
          }
        });
      }
    }
  },
  hideSigninPage: function () {
    this.setData({
      "signinForm.show": false,
      "signinForm.signInImgIdList": [],
      "signinForm.signInImgList": [],
      "signinData.signInImgIds": "",
    });
  },
  hideAllPage: function () {
    this.setData({
      "signinForm.show": false,
      "openSetting.show": false,
      "locationError.show": false,
    });
  }

});


function getCurrentDate() {
  return dateFormat("yyyy-MM-dd HH:mm:ss", new Date());
}

function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "y+": date.getFullYear().toString(), // 年
    "M+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "m+": date.getMinutes().toString(), // 分
    "s+": date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}