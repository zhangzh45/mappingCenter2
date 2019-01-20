/**
 * Created by yuzaizai on 2017/1/17.
 */

$(function(){
    var statisticDataString = document.getElementById("statisticData").value;
    var statisticData = statisticDataString != undefined && statisticDataString!="" ? JSON.parse(statisticDataString): null;
    var maxNum = statisticData[0].value;
    var data = [
        {name : 'Renren',value : 33.1,color:'#b5bcc5'},
        {name : 'Facebook',value : 19.14,color:'#b5bcc5'},
        {name : 'StumbleUpon',value : 13.97,color:'#b5bcc5'},
        {name : 'reddit',value : 7.44,color:'#b5bcc5'},
        {name : 'Hi5',value : 5.22,color:'#b5bcc5'},
        {name : 'LinkedIn',value : 4.85,color:'#b5bcc5'},
        {name : 'Twitter',value : 4.59,color:'#b5bcc5'},
        {name : 'Other',value : 11.68,color:'#b5bcc5'}
    ];

    new iChart.Bar2D({
        render : 'canvasDiv',
        data: statisticData,
        title : {
            text:'映射统计信息表',
            color:'#b5bcc5'
        },
        subtitle : {
            text:'组织职位的业务范围量',
            color:'#afb6c0'
        },
        footnote : 'Data from StatCounter',
        width : 1200,
        height : 600,
        offsetx:20,
        coordinate:{
            width:1000,
            height:400,
            grid_color:'#4e5464',
            axis:{
                color:'#4e5464',
                width:[0,0,8,1]
            },
            scale:[{
                position:'bottom',
                start_scale:0,
                end_scale:maxNum+2,
                scale_space:1,
                label:{color:'#ffffff'},
                listeners:{
                    parseText:function(t,x,y){
                        return {text:t}
                    }
                }
            }]
        },
        label:{color:'#dcdcdc'},
        background_color : '#3c4251',
        sub_option:{
            listeners:{
                parseText:function(r,t){
                    return t;
                }
            }
        },
        legend:{enable:false}
    }).draw();

});
function statisticAnalysis() {
    location.href = "/map/statisticAnalysis";
}

function simAnalysis() {
    location.href = "/map/analysisData";
}

function redundancyAnalysis( ) {
    location.href = "/map/redundancyAnalysis";
}