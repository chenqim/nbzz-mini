const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    date: '',
    workOrderList: [],
    loading: false,
    max: 1,
    page: 2,
    size: 20,
    doneList: false,
    titleMap: {
      circle: '今日在制工单数',
      finsh: '今日完工工单数',
      total: '今日总工单数',
      delivered: '今日已发货',
      pendingDelivered: '今日待发货',
      notFinsh: '今日未完成'
    },
    paramMap: {
      circle: 'artifactOrderCount',
      finsh: 'successOrderCount',
      total: 'totalOrderCount',
      delivered: 'completedOrderCount',
      pendingDelivered: 'executedOrderCount',
      notFinsh: 'processOrderCount'
    }
  },

  queryList(page) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.DASHBOARD_WORK_ORDER,
        loading: loading,
        data: {
          // artifactOrderCount在制工单数、successOrderCount完工工单数、totalOrderCount总工单、completedOrderCount已发货、executedOrderCount待发货、processOrderCount未完成
          byType: this.data.paramMap[this.data.type],
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
      url: '/pages/basics/dashboard/progress/progress?id=' + e.detail.id
    })
  },

  openDialog(e) {
    // console.log('user', app.globalData.user_info)
    // this.queryProcess(e.currentTarget.dataset.id).then(res => {
    //   const canArr = res.filter(n => n.userId === this.data.user_info.id)
    //   this.setData({
    //     processList: res,
    //     show: true,
    //     choosedProcess: canArr[0]?.id || ''
    //   })
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      type: options.type,
      date: options.date
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