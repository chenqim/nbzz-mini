const app = getApp()

Page({

  toMessage(e) {
    wx.navigateTo({
      url: '/pages/basics/message/home/home',
    })
  },

  queryStageDetail(code) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.STAGE_DETAIL,
        loading: loading,
        data: {
          code
        }
      }).then(res => {
        return resolve(res)
      }).catch(err => {
        return reject(err)
      })
    })
  },

  scanQRCode: function () {
    wx.scanCode({
      success: (res) => {
        console.log('QR CODE', res)
        this.queryStageDetail(res.result).then(result => {
          console.log('result >>>>>', result)
          if (result.data.code === '00000') {
            wx.navigateTo({
              url: `/pages/basics/stage/submit/submit?stageCode=${res.result}&stageId=${result.data.data.id}&stageName=${result.data.data.name}`,
            })
          } else {
            Toast(result.data.message)
          }
        })
        .then(() => {
          this.data.loading = false
        })
        .catch(err => {})
      }
    })
  },

  data: {
    user_info: null,
    menuList: {},
    messageCount: '',
    errCount: 0,
    enterpriseName: "",
    loading: false
  },


  onLoad: function (options) {


    if (app.globalData.user_info == null) {
      app.request({
        url: app.api.CURRENT_USER_INFO
      }).then(res => {
        app.globalData.user_info = res.data.data || null
        this.setData({
          user_info: res.data.data || null
        })
        // console.log(res)
      }).catch(err => {
        console.log(err)
      })
    } else {
      this.setData({
        user_info: app.globalData.user_info || null
      })
    }
    // if (app.globalData.appConfig == null) {
    //   app.request({
    //     url: app.api.APP_CONFIG,
    //     toShow: true,
    //     loading: false
    //   }).then(resolve => {
    //     if (resolve.data.code == 1) {
    //       app.globalData.appConfig = resolve.data.data;
    //       this.setData({
    //         enterpriseName: app.globalData.appConfig.enterpriseName
    //       });
    //     }
    //   }).catch(err => {
    //     return wx.reLaunch({
    //       url: '/pages/login/home'
    //     })
    //   });
    // }else{
    //   this.setData({
    //     enterpriseName: app.globalData.appConfig.enterpriseName
    //   });
    // }

    app.request({
      url: app.api.CURRENT_MENT_INFO
    }).then(res => {
      this.setData({
        menuList: res.data.data
      })
    }).catch(err => {})
  },
  queryMessage() {
    var that = this
    return new Promise(function (resolve, reject) {
      app.request({
        url: app.api.MESSAGE_COUNT,
        toShow: true,
        loading: false
      }).then(res => {
        if (res.data.code == '-2' || res.data.code == '-4') {
          app.globalData.internal = true
          clearInterval(app.globalData.queryMessage)
          return wx.showModal({
            title: '提示',
            content: res.data.message + '',
            showCancel: false,
            confirmColor: '#0081ff',
            success(res) {
              if (res.confirm) {
                return wx.redirectTo({
                  url: '/pages/login/home'
                })
              }
            }
          })
        }
        // if(!res.data){

        if (res.data.data) {
          app.globalData.message = res.data.data.unreadMsgCount
          that.setData({
            messageCount: app.globalData.message
          })
        } else {
          wx.showToast({
            title: "消息获取失败，请检查您的网络",
            icon: 'none',
            duration: 2000
          })
        }
        return resolve(res)
      })
    })
  },

  onShow: function () {
    if (app.globalData.internal) {
      app.globalData.internal = false
      app.globalData.queryMessage = setInterval(() => {
        // this.queryMessage()
      }, 15000)
    }
    if(!app.globalData.internal){
      // this.queryMessage()
    }
  },
  onShareAppMessage: function () {

  },
  onMoreTap: function () {
    wx.showModal({
      title: '提示',
      content: '正在开发中，敬请期待',
      confirmColor: '#0081ff',
      showCancel: false
    });
  }
})