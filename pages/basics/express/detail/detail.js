const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    instance: {},
    deliveryList: [],
    trackingTypeMap: {
      1: '上门自提',
      2: '送货上门',
      3: '快递发货'
    },
    loading: false,
    userInfo: null,
    options: null,
  },

  copyTrackingNo(e) {
    const no = e.currentTarget.dataset.no
    wx.setClipboardData({
      data: no,
      success() {
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },

  // 去发货 - 复制链接到剪贴板
  goShip(e) {
    const no = e.currentTarget.dataset.no
    const url = `https://ucmp.sf-express.com/wxaccess/weixin/activity/wxapp_b2sf_order?p1=${no}`
    wx.setClipboardData({
      data: url,
      success() {
        wx.showToast({
          title: '链接已复制，请在浏览器中粘贴打开',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },

  // 跳转顺丰速运+小程序查看物流详情
  viewLogistics(e) {
    const no = e.currentTarget.dataset.no
    // 先复制单号到剪贴板，方便用户进入顺丰小程序后粘贴查询
    wx.setClipboardData({
      data: no,
      success() {
        wx.navigateToMiniProgram({
          appId: 'wxd4185d00bf7e08ac', // 顺丰速运+ AppID
          path: 'pages/tabBar/index/index',
          fail(err) {
            console.error('跳转顺丰速运+失败', err)
            // wx.showToast({
            //   title: '跳转失败，请确认是否安装顺丰速运+小程序',
            //   icon: 'none',
            //   duration: 2000
            // })
          }
        })
      }
    })
  },

  queryDeliveryDetail(id) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.DELIVERY_DETAIL,
        loading: loading,
        data: { id }
      }).then(res => {
        return resolve(res)
      }).catch(err => {
        return reject(err)
      })
    })
  },

  queryDetail(id) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.WORK_ORDER_DETAIL,
        loading: loading,
        data: {
          id
        }
      }).then(res => {
        return resolve(res)
      }).catch(err => {
        return reject(err)
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('on load >>>>>', options.id)
    Promise.all([
      this.queryDetail(options.id),
      this.queryDeliveryDetail(options.id)
    ]).then(([detailRes, deliveryRes]) => {
      this.setData({
        instance: detailRes.data.data,
        deliveryList: deliveryRes.data.data || [],
        userInfo: app.globalData.user_info || null,
        options
      })
    })
    .then(() => {
      this.data.loading = false
    })
    .catch(err => {})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log("on show >>>>>")
    if (this.data.options) this.onLoad(this.data.options)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log("onPullDownRefresh >>>>>")
    if (this.data.options) {
      this.onLoad(this.data.options)
      wx.showToast({
        title: '刷新成功',
        icon: 'none',
        duration: 2000
      })
      wx.stopPullDownRefresh({})
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})