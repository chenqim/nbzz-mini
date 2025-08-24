const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    show: false,
    minDate: new Date(2025, 0, 1).getTime(),
    maxDate: new Date().getTime(),
    top: {
      completedOrderCount: -1,
      completedOrderRatio: -1,
      executedOrderCount: -1,
      processOrderCount: -1,
      totalOrderCount: -1
    },
    bottom: {
      successArtifactCount: -1,
      successOrderCount: -1,
      totalArtifactCount: -1,
      totalOrderCount: -1,
      totalWorkerCount: -1
    }
  },

  goToDetail (e) {
    wx.navigateTo({
      url: '/pages/basics/dashboard/detail/detail?type=' + e.currentTarget.dataset.type
    })
  },

  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${date.getFullYear()}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  },
  onConfirm(event) {
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    })
    this.queryAll()
  },

  queryTop() {
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.ORDER_ACHIEVE_TOTAL,
        loading: false,
        data: {
          targetDate: this.data.date
        }
      }).then(res => {
        return resolve(res.data.data)
      }).catch(err => {
        return reject(err)
      })
    })
  },

  queryBottom() {
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.PRODUCE_EXECUTE_TOTAL,
        loading: false,
        data: {
          targetDate: this.data.date
        }
      }).then(res => {
        return resolve(res.data.data)
      }).catch(err => {
        return reject(err)
      })
    })
  },

  queryAll() {
    wx.showLoading({
      title: '加载中'
    })
    Promise.all([
      this.queryTop().then(res => {
        console.log('top', res)
        this.setData({
          top: res
        })
      }),
      this.queryBottom().then(res => {
        console.log('bottom', res)
        this.setData({
          bottom: res
        })
      })
    ]).then(() => {
      wx.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      date: this.formatDate(new Date())
    })
    this.queryAll()
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
    this.setData({
      date: this.formatDate(new Date())
    })
    this.queryAll()
    wx.stopPullDownRefresh({})
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