//app.js
import api from '/utils/api'
import http from '/utils/request'
import baseurl from '/utils/config'
import Toast from './miniprogram_npm/@vant/weapp/toast/toast'
import tool from '/utils/tool'

App({
  api,
  request: http.request,
  baseurl: baseurl.apiPrefix,
  upload: http.uploadFile,
  Toast,
  throttle:tool.throttle,
  debounce:tool.debounce,
  throttlesync:tool.throttlesync,
  onLaunch: function () {
    //获得系统信息
    const token = wx.getStorageSync('token')

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    // wx.login({
    //   success: res => {

    //   }
    // })
    // 获取用户信息

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  /**
   * 设置消息数message的监听器
   */
  watch:function(method){
    var obj = this.globalData;
    Object.defineProperty(obj,"message", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._message = value;
        // console.log('是否会被执行')
        method(value);
      },
      get:function(){
      // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.message的时候，这里就会执行。
        return this._message
      }
    })
  },
  globalData: {
    userInfo: null,
    user_info: null,
    appConfig: null,
    message: '',
    internal: true,
    queryMessage: null,
    limit:15
  }
})