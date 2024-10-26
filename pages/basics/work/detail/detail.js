// pages/basics/work/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    instance: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      instance: {
        id: 202410230110,
        name: '测试工单henchang工单工单工单工单工单工单工单工单工单工单1',
        level: '紧急',
        type: '类型1',
        productName: '钻石切割刀',
        number: '9999',
        status: '未认领',
        remark: '这里是备注这里是备注这里是备注这里是备注这里是备注这里是备注这里是备注这里是备注',
        time: '2024-10-26 18:00:00'
      }
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