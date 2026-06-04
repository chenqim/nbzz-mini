const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    date: '',
    show: false,
    minDate: new Date(2025, 0, 1).getTime(),
    maxDate: new Date().getTime(),
    workOrderList: [],
    loading: false,
    max: 1,
    page: 2,
    size: 20,
    doneList: false,
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
    this.data.page = 2
    this.queryList(1)
      .then(res => {
        this.setData({
          workOrderList: res,
          max: res.pages
        })
        this.setData({
          doneList: this.data.max >= this.data.page
        })
      })
      .catch(err => {})
  },

  queryList(page) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.DASHBOARD_WORK_ORDER,
        loading: loading,
        data: {
          byType: 'byDeliveryDate',
          targetDate: this.data.date
        }
      }).then(res => {
        return resolve(res.data.data)
      }).catch(err => {
        return reject(err)
      })
    })
  },

  goToDetail (e) {
    wx.navigateTo({
      url: '/pages/basics/express/detail/detail?id=' + e.detail.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      date: this.formatDate(new Date())
    })
    this.queryList(1)
      .then(res => {
        this.setData({
          workOrderList: res,
          max: res.pages
        })
        this.setData({
          doneList: this.data.max >= this.data.page
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
    this.data.page = 2
    this.queryList(1)
      .then(res => {
        this.setData({
          workOrderList: res,
          max: res.pages
        })
        this.setData({
          doneList: this.data.max >= this.data.page
        })
        wx.showToast({
          title: '刷新成功',
          icon: 'none',
          duration: 2000
        })
        wx.stopPullDownRefresh({})
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.doneList) {
      this.queryList(this.data.page)
        .then(res => {
          this.setData({
            workOrderList: this.data.workOrderList.concat(res)
          })
          this.data.page++
          this.setData({
            doneList: this.data.max >= this.data.page
          })
        })
        .catch(err => {})
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})