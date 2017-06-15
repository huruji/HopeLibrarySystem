var charts = {
  pie: function(ele, title, seriesName, data){
    var mycharts = echarts.init(ele);
    var options;
    options = {
      color:['#1c95ea','#8fc31f','#f35833','#00ccff','#ffcc00','#3423d2','#145988'],
      title:{
        text:title,
        textStyle: {
          color: '#1c95ea'
        }
      },
      series:[{
        name:seriesName,
        type:'pie',
        data:data,
        itemStyle:{
          normal:{
            label:{
              show: true,
              formatter: '{b} : {c} ({d}%)'
            }
          }
        }
      }]
    };
    mycharts.setOption(options);
  },
  bar: function(ele, title,titleColor,legendName,xName,xData,yName,seriesData,itemColor,itemActColor){
    var mycharts = echarts.init(ele);
    var options;
    options = {
      title: {
        show: true,
        text: title,
        textStyle: {
          color: titleColor || '#1c95ea'
        }
      },
      tooltip: {},
      legend: {
        data: [legendName],
      },
      xAxis: {
        data: xData,
        name: xName,
        nameLocation: 'end',
        nameTextStyle: {
          color: titleColor || '#1c95ea',
          fontWeight: 'bold'
        },
        nameGap: 30
      },
      yAxis: {
        name: yName,
        nameLocation: 'end',
        nameTextStyle: {
          color: titleColor || '#1c95ea',
          fontWeight: 'bold'
        },
        nameGap: 15
      },
      series: [{
        name:legendName,
        type: 'bar',
        data: seriesData,
        itemStyle: {
          normal: {
            color: itemColor || '#1c95ea',
            barBorderRadius: [5, 5, 0, 0]
          },
          emphasis: {
            color: itemActColor || '#045e9d',
          }
        },
        barGap: '50%'
      }]
    };
    mycharts.setOption(options);
  }
};
var htime = {
  getDiff: function(num){
    var time;
    if(num){
      time = new Date(new Date().getTime() - num*24*60*60*1000);
    }else{
      time = new Date();
    }
    return this.parseTime(time);
  },
  parseTime: function(time) {
    var year = time.getFullYear();
    var month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1);
    var day = time.getDay() > 9 ? time.getDay(): '0' + time.getDay();
    return year + '-' + month + '-' + day;
  }
};
