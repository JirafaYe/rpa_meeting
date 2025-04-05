// ... existing code ...
    // 选择日期
    selectDate(date) {
      console.log('选择日期:', date);
      
      // 先置空，强制UI刷新
      this.selectedDate = '';
      
      // 使用nextTick确保DOM更新后再设置新值
      this.$nextTick(() => {
        const dateStr = this.formatDateString(date);
        this.selectedDate = dateStr;
        
        // 筛选该日期的事件
        this.currentEvents = this.filterEventsByDate(dateStr);
        
        console.log(`日期 ${dateStr} 的事件数量:`, this.currentEvents.length);
      });
    },
// ... existing code ...