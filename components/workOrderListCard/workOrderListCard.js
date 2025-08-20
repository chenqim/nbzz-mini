// pages/workOrderListCard.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {},
    },
    from: {
      type: String,
      value: 'work' // work：我的工单 today：工单池 situation：工单进度 dispatch：派单
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    gradeMap: {
      middle: '普通',
      high: '紧急'
    },
    gradeTypeMap: {
      middle: 'success',
      high: 'danger'
    },
    typeMap: {
      produce: '制造',
      maintenance: '维修'
    },
    statusMap: {
      create: '已创建',
      receive: '已认领',
      producing: '生产中',
      executed: '待发货',
      completed: '已完成'
    },
    statusTypeMap: {
      create: 'primary',
      receive: 'danger',
      producing: 'warning',
      executed: 'primary',
      completed: 'success'
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToDetail (e) {
      this.triggerEvent('gotodetail', { id: e.currentTarget.dataset.id })
    },
    openDialog (e) {
      this.triggerEvent('opendialog', { id: e.currentTarget.dataset.id })
    }
  }
})