const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    instance: {},
    loading: false,
    options: null
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
    console.log(options.id)
    this.queryDetail(options.id).then(res => {
      this.setData({
        instance: res.data.data,
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