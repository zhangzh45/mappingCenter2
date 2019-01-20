/**
 * Created by yuzaizai on 2017/3/31.
 */
$(function(){
    var analysisDataString = document.getElementById("analysisData").value;
    var analysisData = analysisDataString != undefined && analysisDataString!="" ? JSON.parse(analysisDataString): null;
    var _endScale= parseInt(analysisData[0].value) + 20;
    var _topNum  = 10; // 显示排名前十的相似度的数据
    var _dataArray = new Array();
    var labels =  new Array();
    for ( var i =0 ;i < analysisData.length; i++ ) {
        if ( _topNum == 0 ||  analysisData[i].value == 0 )  break;
        var _obj = new Object();
       // _obj["name"] = analysisData[i].name;
        _obj["value"] = analysisData[i].value;
        _obj["color"] = i==0?'#a14545':getRandomColor();
        _dataArray.push(_obj); // pos1 的名字
        labels[i] =  analysisData[i].name+"与"+analysisData[i].fName; // pos2的名字
        if ( (i+1) < analysisData.length && analysisData[i].sim == analysisData[i+1].sim ) {
            // 如果前后两个数据相似度相同则计数不变
        } else {
            _topNum--;
        }
    }
    //创建随机数据源
    var create = function (){
        var f = function(){return Math.floor(Math.random()*40)+10;},opacity = 0.8;
        return function(){
            return [
                {name : 'Jan-Mar',value : f(),color:'#827fbf'},
                {name : 'Apr-Jun',value : f(),color:'#e4be4d'},
                {name : 'Jul-Sep',value : f(),color:'#91aa51'},
                {name : 'Oct-Dec',value : f(),color:'#a14545'}
            ]
        }
    }();
    var chart = new iChart.Column2D({
        id:'analysisChart',
        render : 'analysisDiv',
        data: _dataArray,
        title : {
            text:'职位相似度情况',
            color:'#4e5665',
            padding:'0 40',
            font:'微软雅黑',
            height:40
        },
        subtitle : {
            text:'单位:百分比',
            color:'#4e5665',
            padding:'0 40',
            font:'微软雅黑',
            height:30
        },
        background_color : '#fdfdfd',
        padding:'4 0',
        width : 1200,
        height : 600,
        label : {
            fontsize:13,
            fontweight:600,
            font:'微软雅黑',
            color : '#4572a7'
        },
        shadow : true,
        shadow_blur : 2,
        shadow_color : '#8887bf',
        shadow_offsetx : 1,
        shadow_offsety : 1,
        tip:{
            enable:true,
            shadow:true,
            listeners:{
                //tip:提示框对象、name:数据名称、value:数据值、text:当前文本、i:数据点的索引
                parseText:function(tip,name,value,text,i){
                    return "<span style='color:#005268;font-size:15px;'>"+labels[i]+"<br/>"+
                        "</span><span style='color:#005268;font-size:20px;'>"+"相似度为"+value+"%</span>";
                }
            }
        },
        sub_option:{
            listeners : {
                parseText : function(r, t) {
                    return "%"+t;
                }
            },
            border:{
                enable:true,
                color:'#666666'
            },
            label : {
                fontsize:10,
                fontweight:600,
                font:'微软雅黑',
                color : '#4572a7'
            }
        },
        coordinate:{
            width:'88%',
            height:'74%',
            axis : {
                color : '#666791',
                width : [0, 0, 2, 0]
            },
            scale:[{
                position:'left',
                start_scale:0,
                end_scale:_endScale,
                scale_enable : false,
                label : {
                    fontsize:12,
                    font:'微软雅黑',
                    color : '#4572a7'
                },
                listeners:{
                    parseText:function(t,x,y){
                        return {text:"%"+t}
                    }
                }
            }]
        }
    });
    chart.draw();


function load(){
    var chart = $.get('analysisChart');//根据ID获取图表对象
    chart.load(create());//载入新数据
}
});
function getRandomColor() {
    return  '#' +
        (function(color){
            return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])
            && (color.length == 6) ?  color : arguments.callee(color);
        })('');
}
function statisticAnalysis() {
    location.href = "/map/statisticAnalysis";
}

function simAnalysis() {
    location.href = "/map/analysisData";
}
function redundancyAnalysis( ) {
    location.href = "/map/redundancyAnalysis";
}