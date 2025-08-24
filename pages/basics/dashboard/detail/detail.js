const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    workOrderList: [],
    loading: false,
    max: 1,
    page: 2,
    size: 10,
    doneList: false,
  },

  queryList(page) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.LATELY_WORK_ORDER,
        loading: loading,
        data: {
          pageParam: {
            page,
            size: this.data.size
          },
          queryParam: {
            // name: this.data.searchValue
          }
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
      type: options.type
    })
    this.queryList(1)
      .then(res => {
        this.setData({
          workOrderList: res.records,
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
          workOrderList: res.records,
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
            workOrderList: this.data.workOrderList.concat(res.records)
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