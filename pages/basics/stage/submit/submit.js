// pages/basics/stage/submit/submit.js
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stageId: '',
    radio: '1',
    workOrder: '',
    process: '',
    count: 1,
    show1: false,
    columns1: ['工单1', '工单2', '工单3', '工单4', '工单5'],
    show2: false,
    columns2: ['工序1', '工序2', '工序3', '工序4', '工序5']
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },

  showPopup1() {
    this.setData({ show1: true });
  },

  onClose1() {
    this.setData({ show1: false });
  },

  onChange1(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },

  onConfirm1(event) {
    const { picker, value, index } = event.detail;
    // Toast(`当前值：${value}, 当前索引：${index}`);
    this.setData({
      workOrder: value
    })
    this.onClose1()
  },

  onCancel1() {
    this.onClose1()
    Toast('取消');
  },

  showPopup2() {
    this.setData({ show2: true });
  },

  onClose2() {
    this.setData({ show2: false });
  },

  onChange2(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },

  onConfirm2(event) {
    const { picker, value, index } = event.detail;
    // Toast(`当前值：${value}, 当前索引：${index}`);
    this.setData({
      process: value
    })
    this.onClose2()
  },

  onCancel2() {
    this.onClose2()
    Toast('取消');
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.id)
    this.setData({
      stageId: options.id
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