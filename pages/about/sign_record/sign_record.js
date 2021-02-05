// pages/about/sign_record/sign_record.js
const app = getApp()
Page({
  queryList(page) {
    return new Promise(function (resolve, reject) {
      const that = this
      app.request({
        url: app.api.SIGNIN_PAGE,
        loading: page==1,
        data: {
          limit: 15,
          page: page
        }
      }).then(res => {
        return resolve(res)
      }).catch(err => {
        return reject(err)
      })
    });
  },
  /**
   * 页面的初始数据
   */
  data: {
    signRecordList: null,
    page: 2,
    max: 1,
    doneList: false,
    time: [],
    week: []
  },

  getWeek(date) {
    var week;
    if (date.getDay() == 0) week = "周日"
    if (date.getDay() == 1) week = "周一"
    if (date.getDay() == 2) week = "周二"
    if (date.getDay() == 3) week = "周三"
    if (date.getDay() == 4) week = "周四"
    if (date.getDay() == 5) week = "周五"
    if (date.getDay() == 6) week = "周六"
    return week;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryList(1).then(res => {
      res.data.data.map(e => {
        e.time = e.signInDate.substring(5, 16)
      })
      res.data.data.map(e => {
        e.week = this.getWeek(new Date(e.signInDate.split(' ')[0])) 
      })
      this.setData({
        ['signRecordList[0]']: res.data.data,
        max: Math.ceil(res.data.count / 15)
      })
      this.setData({
        doneList: this.data.max >= this.data.page
      })
      
    }).catch(err => {})


  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.doneList) {
      this.queryList(this.data.page).then(res => {
        res.data.data.map(e => {
          e.time = e.signInDate.substring(5, 16)
        })
        res.data.data.map(e => {
          e.week = this.getWeek(new Date(e.signInDate.split(' ')[0])) 
        })
        this.setData({
          // signRecordList: this.data.signRecordList.concat(res.data.data)
          ["signRecordList[" + (this.data.page-1) + "]"]:res.data.data,
        })
        this.data.page++
        this.setData({
          doneList: this.data.max >= this.data.page
        })
      }).catch(err => {});
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})