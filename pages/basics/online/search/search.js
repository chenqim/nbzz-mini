const app = getApp()
import Toast from '../../../../miniprogram_npm/@vant/weapp/toast/toast'
Page({

  search() {
    if (this.data.startDate!='请选择开始日期' && this.data.endDate!='请选择结束日期' && this.data.siteId && this.data.type) {
      this.data.queryDate = this.data.startDate + ' - ' + this.data.endDate
      wx.navigateTo({
        url: '../history/history?id=' + this.data.siteId + '&type=' + this.data.type + '&time=' + this.data.queryDate,
        success: (result) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    } else {
      Toast({
        message: '请将选项选择完全',
        forbidClick: true,
        position: 'top',
        selector: '#onlineSearch'
      });
    }
  },


  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  timePickerChange(e) {
    if(e.detail.value==0){
      this.setData({
        startDate:'请选择开始日期',
        endDate:'请选择结束日期',
      })
    }else{
      this.setData({
        minDate: '2020-01-01',
        maxDate: this.fun_data(0),
      })
    }
    this.setData({
      timeindex: e.detail.value,
      type: this.data.timetypes[e.detail.value]
    })
  },
  sitePickerChange(e) {
    this.setData({
      siteindex: e.detail.value,
      siteId: this.data.site[e.detail.value].id
    })
    console.log(this.data.siteId);
  },
  DateChange(e) {
    if(this.data.type=='realTime'){
      this.setData({
        startDate: e.detail.value,
        tempEnd:e.detail.value,
        endDate:'请选择结束日期',
        maxDate:this.fun_data(30,e.detail.value)
      })
    }else{
      this.setData({
        startDate: e.detail.value,
        tempEnd:e.detail.value,
        endDate:'请选择结束日期'
      })
    }
  },
  endDateChange(e) {
    if(this.data.type=='realTime'){
      this.setData({
        endDate: e.detail.value,
        // tempStart:e.detail.value,
        // minDate:this.fun_data(-30,e.detail.value)
      })
    }else{  
      this.setData({
        endDate: e.detail.value,
        // tempStart:e.detail.value
      })
    }
  },
  fun_data(aa,date) {
    var date1 = new Date(date)||new Date()
     var time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1
      .getDate()
    //time1表示当前时间
    var date2 = new Date(date1)
    date2.setDate(date1.getDate() + aa)
    var time2 = date2.getFullYear().toString() + "-" + (date2.getMonth() + 1 > 10 ? (date2
      .getMonth() + 1) : ("0" + (date2.getMonth() + 1))) + "-" + (date2.getDate() > 10 ? (date2.getDate()) : ("0" + date2.getDate()))
    return time2
  },
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    factorData: 0,
    timetype: ['实时数据', '分钟数据', '小时数据', '天数据'],
    timetypes: ['realTime', 'minute', 'hour', 'day'],
    siteList: [],
    startDate: '请选择开始日期',
    endDate: '请选择结束日期',
    minDate: '2020-01-01',
    maxDate: '',
    tempStart:'',
    tempEnd:'2020-01-01',
    show: false,
  },

  onLoad: function (options) {
    this.setData({
      custombar: app.globalData.CustomBar,
      maxDate:this.fun_data(0),
      tempStart:this.fun_data(0)
    })
    app.request({
      url: app.api.SITE_LIST,
    }).then(res => {
      this.setData({
        site: res.data.data,
        siteList: res.data.data.map(({
          name
        }) => name)
      })
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },
  onUnload: function () {

  },

})