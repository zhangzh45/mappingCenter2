/**
 * Created by yuzaizai on 2016/11/3.
 */
$(document).ready( function() {
    var rolemappString = document.getElementById("rolemapps").value;
    var rolemappObj = JSON.parse(rolemappString);
    PlumbInitial(rolemappObj);
});

 function PlumbInitial( mappingRelation) {
     jsPlumb.ready(function() {  // 初始化，jsPlumb只有等到DOM初始化完成之后才能使用
         jsPlumb.importDefaults({  // 给jsPlumb设一些默认值
             DragOptions: {cursor: 'pointer', zIndex: 2000},
             PaintStyle:{
                 lineWidth:4,
                 strokeStyle:"#567567",
                 outlineColor:"black",
                 outlineWidth:1
             },
             EndpointStyle: {width: 10, height: 16, strokeStyle: '#666'},
             Endpoint: "Rectangle",
             Anchors: ["TopCenter"],
             //控制是否有箭头
             ConnectionOverlays: [
                 ["Arrow", {
                     location: 1,
                     width: 10,
                     length: 10
                 }],
                 ["Label", {
                     location: 0.1,
                     id: "label",
                     cssClass: "aLabel"
                 }]
             ]
         });
         var exampleDropOptions = {
             hoverClass: "dropHover",
             activeClass: "dragActive"
         };
         var basicType = {
             connector: "StateMachine",
             paintStyle: {strokeStyle: "red", lineWidth: 4},
             hoverPaintStyle: {strokeStyle: "blue"},
             overlays: [
                 "Arrow"
             ]
         };
         jsPlumb.registerConnectionType("basic", basicType);
         var color1 = "#316b31";
         // 添加jsPlumb连接点
         function createEndpoint( uuid) {
             // 添加jsPlumb连接点
             return {
                 uuid: uuid,
                 endpoint: ["Dot", {radius: 4}],//连接点的形状、大小
                 paintStyle: {fillStyle: color1},//连接点的颜色
                 isSource: true,   //是否可以拖动（作为连线起点）
                 scope: "green dot",////连接点的标识符，只有标识符相同的连接点才能连接 点击该颜色的时候，其余该颜色的点都会显示虚线框
                 connectorStyle: {strokeStyle: color1, lineWidth: 4},//点与点之间连线颜色,粗细
                 connector: ["Bezier", {curviness: 63}],//设置连线为贝塞尔曲线
                 maxConnections:-1,//设置连接点最多可以连接几条线(-1表示允许无限多的连接数)
                 isTarget: true,  //是否可以放置（作为连线终点）
                 dropOptions: exampleDropOptions //设置放置相关的css
             };
         }
         //左上角为起点，0.2表示相对x的偏移量，0.5表示相对y的偏移量
         // 将连接点绑定到html元素上  连接点分为动态连接点和静态连接点。当指定一个数组作为连接点时，
         // 该连接点为动态连接点，连线时会自动选择最近的连接点连接；
         // 当指定一个坐标或者固定位置（TopRight、RightMiddle等）作为连接点时，该连接点为静态连接点，不管怎么连线都不会移动
         //var anchors = [[0.2, 0.5, 1, 0], [0.8, 1, 0, 1], [0, 0.8, -1, 0], [0.2, 0, 0, -1]];


         //jsPlumb.addEndpoint("state3",{anchor: anchors}, createEndpoint(103));
         //var des= [[101,102]];
         //固定连线
         if ( mappingRelation != null && mappingRelation.length > 0 ) {
             for ( var i = 0;i<mappingRelation.length;i++ ) {
                 jsPlumb.addEndpoint(mappingRelation[i][0], {anchor: "Right"}, createEndpoint(mappingRelation[i][0])); // organ
                 jsPlumb.addEndpoint(mappingRelation[i][1],{anchor: "Left"}, createEndpoint(mappingRelation[i][1]));  // busi
                 jsPlumb.connect({uuids: mappingRelation[i]});
             }
         }

         // jsPlumb.connect({uuids: des});
         // jsPlumb.connect({uuids: [102, 1021]});
         //jsPlumb.connect({uuids: [101, 10111]});
         //可拖动
         jsPlumb.draggable($('._jsPlumb_endpoint_anchor_'));

     });
 }
function partialMapping(type,id) {
    jsPlumb.detachEveryConnection();
    var tp = type=='organ'? 0:1; // 映射的对象数组0号位置存的是organPosId，1号位置存的是busiId
    var partialMappObj = new Array(); // 部分映射关系对象数组
    var partialStringMapp = document.getElementById('partialrolemap').value; // 获取之前已选中的映射信息
    if ( partialStringMapp != "" ) { // 若不为空
        partialMappObj = JSON.parse(partialStringMapp); // 将json字符串转成json对象
    }
    var isClick = document.getElementById(id).value==0;
    if ( isClick ) { // 若该按钮未被点击过,点击添加该按钮的映射关系
        var rolemappString = document.getElementById("rolemapps").value; // 获取所有角色映射关系对象
        var rolemappObj = JSON.parse(rolemappString);
        if ( rolemappObj != null && rolemappObj.length>0 ) {
            for ( var i=0 ; i < rolemappObj.length ; i++ ) {
                if (id == rolemappObj[i][tp] ) {  // 若为选中的id的映射关系则添加
                    partialMappObj.push(rolemappObj[i]);
                }
            }
        }
        $('#'+id).css('color','rgba(255, 255, 255, 0.9)');
        $('#'+id).css('background-color','rgba(92, 184, 92, 1)');
        document.getElementById(id).setAttribute('value',1); // 更新点击信息
        document.getElementById('partialrolemap').setAttribute('value',JSON.stringify(partialMappObj)); // 更新部分映射信息
        PlumbInitial(partialMappObj);
    } else {   // 若该按钮已被点击过,再次点击则取消该按钮的映射关系
        var  partialMappArrayNew = new Array();
        if ( partialMappObj != null && partialMappObj.length >0 ) {
            for ( var j=0 ; j < partialMappObj.length ; j++ ) {
                if ( id == partialMappObj[j][tp]) {  // 若为选中的id的映射关系则删除该关系
                    // 则不将该关系加入新的数组中
                } else { // 保留无关的映射关系
                   partialMappArrayNew.push(partialMappObj[j]);
                }
            }
        }
        $('#'+id).css('color','rgba(92, 184, 92, 1)');
        $('#'+id).css('background-color','rgba(255, 255, 255, 0.9)');
        document.getElementById(id).setAttribute('value',0); // 更新点击信息
        document.getElementById('partialrolemap').setAttribute('value',JSON.stringify(partialMappArrayNew)); // 更新部分映射信息
        PlumbInitial(partialMappArrayNew);
    }

}
