// pages/basics/work/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  goToDetail () {
    wx.navigateTo({
      url: '/pages/basics/work/detail/detail'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const arr = []
    for (let index = 0; index < 10; index++) {
      arr.push({
        id: index,
        name: '测试工单henchang工单工单工单工单工单工单工单工单工单工单' + index,
        level: index > 3 ? '普通' : '紧急',
        type: '类型' + index,
        productName: '钻石切割刀很长很长很长很长很长很长很长',
        number: '9999',
        status: index > 3 ? '已认领' : '未认领',
        remark: '这里是备注',
        time: '2024-10-26 18:00:00'
      })
    }
    this.setData({
      list: arr
    })
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
    // console.log('监听用户下拉动作')
    // this.setData({
    //   list: [1, 2, 3]
    // })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 100)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // wx.showLoading({
    //   title: '加载中...',
    // })
    // console.log('监听用户页面上拉')
    // setTimeout(() => {
    //   const last = this.data.list[this.data.list.length - 1]
    //   const newArr = [last + 1, last + 2, last + 3]
    //   this.setData({
    //     list: [...this.data.list, ...newArr]
    //   })
    //   wx.hideLoading()
    // }, 800)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})