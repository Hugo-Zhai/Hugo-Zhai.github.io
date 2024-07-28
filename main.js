const width = 960;
const height = 580;
const margin = { top: 50, right: 30, bottom: 30, left: 150 };

const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let data;

// 加载数据并初始化场景1
d3.csv("cars2017.csv").then(csvData => {
    data = csvData.map(d => ({
        make: d.Make,
        fuel: d.Fuel,
        engineCylinders: +d.EngineCylinders,
        highwayMPG: +d.AverageHighwayMPG,
        cityMPG: +d.AverageCityMPG
    }));
    scene1();
});

// 场景1：展示各个汽车品牌的平均高速公路油耗
function scene1() {
    svg.selectAll("*").remove();
    const groupedData = d3.group(data, d => d.make);
    const averageHighwayMPG = Array.from(groupedData, ([make, values]) => ({
        make: make,
        highwayMPG: d3.mean(values, d => d.highwayMPG)
    }));

    const y = d3.scaleBand().domain(averageHighwayMPG.map(d => d.make)).range([margin.top, height - margin.bottom]).padding(0.1);
    const x = d3.scaleLinear().domain([0, d3.max(averageHighwayMPG, d => d.highwayMPG)]).range([margin.left, width - margin.right]);

    const xAxis = d3.axisBottom(x); 
    const yAxis = d3.axisLeft(y); 

    svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(xAxis).attr("class", "bold");
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis).attr("class", "bold");

svg.selectAll(".bar")  
    .data(averageHighwayMPG)  
    .enter().append("rect")  
    .attr("class", "bar")  
    .attr("y", d => y(d.make))  
    .attr("x", d => x(0))  
    .attr("width", d => x(d.highwayMPG) - x(0))  
    .attr("height", y.bandwidth())  
    .attr("fill", "steelblue")  
    .on("mouseover", function(event, d) {  
        // 更改当前条柱的颜色为白色  
        d3.select(this) // 'this' 指的是当前触发事件的矩形元素  
            .attr("fill", "red");  
  
        // 更新tooltip的内容  
        d3.select("#tooltip")  
            .style("visibility", "visible")  
            .html(`Car Make: ${d.make}<br><br>Highway MPG: ${d.highwayMPG.toFixed(2)}`)  
            // 计算并设置tooltip的位置  
            .style("left", (event.pageX) + "px")  
            .style("top", (event.pageY - 28) + "px");  
    })  
    .on("mouseout", function(d) {  
        // 当鼠标移出时，恢复条柱的原始颜色并隐藏tooltip  
        d3.select(this) // 'this' 指的是当前触发事件的矩形元素  
            .attr("fill", "steelblue"); // 恢复原始颜色  
        d3.select("#tooltip").style("visibility", "hidden");  
    });

// 添加图表标题
svg.append("text")
.attr("x", width / 2)
.attr("y", 40 )
.attr("text-anchor", "middle")
.style("font-size", "20px")
.style("font-weight", "bold")
.text("Average Highway MPG by Car Make")
.attr("fill", "blue");

// 添加图例
const legend = svg.append("g")
.attr("class", "legend")
.attr("x", width - margin.right - 100)
.attr("y", margin.top + 20)
.attr("height", 100)
.attr("width", 100);

// 只有一种颜色的条形，图例可以是简单的文本或颜色方块
legend.append("rect")
.attr("x", 820)
.attr("y", 20)
.attr("width", 20)
.attr("height", 20)
.style("fill", "steelblue");

legend.append("text")
.attr("x", 710)
.attr("y", 40)
.text("Highway MPG")
.style("font-weight", "bold")
.attr("fill", "steelblue");


// 添加 X 轴标题
svg.append("text")
.attr("class", "x-axis-title") // 可以为标题添加样式类
.attr("x", width / 2)          // 将标题放置在 X 轴的中点
.attr("y", height - margin.bottom + 25) // 将标题放置在 X 轴下方一段距离
.attr("text-anchor", "middle") // 使文本居中对齐
.text("Highway MPG(/Miles)")            // X 轴标题文本
.style("font-weight", "bold")
.attr("fill", "blue");        

// 添加 Y 轴标题
svg.append("text")
.attr("class", "y-axis-title") // 可以为标题添加样式类
//.attr("transform", "rotate(-90)") // 将标题旋转90度
.attr("x", 80 ) // 将标题的中心放置在 Y 轴的中点
.attr("y", 50) // 将标题放置在 Y 轴左侧一段距离
.attr("text-anchor", "middle") // 使文本居中对齐
.text("Car Makes")
.style("font-weight", "bold")
.attr("fill", "blue");           // Y 轴标题文本

    // 添加注释
    const annotations = [
        {
            note: {
                label: "Tesla",
                title: "Max Highway MPG Make: "
            },
            x: 660,
            y: 510,
            dy: -30,
            dx: 50
        }
    ];

    const makeAnnotations = d3.annotation().annotations(annotations);
    svg.append("g").call(makeAnnotations);

        // 添加注释
        const annotations1 = [
            {
                note: {
                    label: "Aston Martin、Ferrari、Lamborghini、Rolls-Royce",
                    title: "Min Highway MPG Make"
                },
                x: 460,
                y: 180,
                dy: -30,
                dx: 50, 
              
            }     
        ];
        const makeAnnotations1 = d3.annotation().annotations(annotations1);
        svg.append("g").call(makeAnnotations1);

}

// 场景2：展示各个汽车品牌的平均城市油耗
function scene2() {
    svg.selectAll("*").remove();
    const groupedData = d3.group(data, d => d.make);
    const averageCityMPG = Array.from(groupedData, ([make, values]) => ({
        make: make,
        cityMPG: d3.mean(values, d => d.cityMPG)
    }));

    const y = d3.scaleBand().domain(averageCityMPG.map(d => d.make)).range([margin.top, height - margin.bottom]).padding(0.1);
    const x = d3.scaleLinear().domain([0, d3.max(averageCityMPG, d => d.cityMPG)]).range([margin.left, width - margin.right]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(xAxis).attr("class", "bold");
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis).attr("class", "bold");

svg.selectAll(".bar")  
    .data(averageCityMPG)  
    .enter().append("rect")  
    .attr("class", "bar")  
    .attr("y", d => y(d.make))  
    .attr("x", d => x(0))  
    .attr("width", d => x(d.cityMPG) - x(0))  
    .attr("height", y.bandwidth())  
    .attr("fill", "orange")  
    .on("mouseover", function(event, d) {  
        // 更改当前条柱的颜色为白色  
        d3.select(this) // 'this' 指的是当前触发事件的矩形元素  
            .attr("fill", "blue");  
  
        // 更新tooltip的内容  
        d3.select("#tooltip")  
            .style("visibility", "visible")  
            .html(`Car Make: ${d.make}<br><br>City MPG: ${d.cityMPG.toFixed(2)}`)  
            // 计算并设置tooltip的位置  
            .style("left", (event.pageX) + "px")  
            .style("top", (event.pageY - 28) + "px");  
    })  
    .on("mouseout", function(d) {  
        // 当鼠标移出时，恢复条柱的原始颜色并隐藏tooltip  
        d3.select(this) // 'this' 指的是当前触发事件的矩形元素  
            .attr("fill", "orange"); // 恢复原始颜色  
        d3.select("#tooltip").style("visibility", "hidden");  
    });

     // 添加注释
     const annotations = [
        {
            note: {
                label: "Tesla",
                title: "Max City MPG Make: "
            },
            x: 660,
            y: 510,
            dy: -30,
            dx: 50
        }
    ];

    const makeAnnotations = d3.annotation().annotations(annotations);
    svg.append("g").call(makeAnnotations);

        // 添加注释
        const annotations1 = [
            {
                note: {
                    label: "Aston Martin、Ferrari、Lamborghini、Rolls-Royce",
                    title: "Min City MPG Make"
                },
                x: 460,
                y: 180,
                dy: -30,
                dx: 50, 
              
            }
            
        ];
    
        const makeAnnotations1 = d3.annotation().annotations(annotations1);
        svg.append("g").call(makeAnnotations1);
  
                // 添加图表标题
svg.append("text")
.attr("x", width / 2)
.attr("y", 40 )
.attr("text-anchor", "middle")
.style("font-size", "20px")
.style("font-weight", "bold")
.text("Average city MPG of various car makes")
.attr("fill", "blue");

// 添加图例
const legend = svg.append("g")
.attr("class", "legend")
.attr("x", width - margin.right - 100)
.attr("y", margin.top + 20)
.attr("height", 100)
.attr("width", 100);

// 只有一种颜色的条形，图例可以是简单的文本或颜色方块
legend.append("rect")
.attr("x", 850)
.attr("y", 20)
.attr("width", 20)
.attr("height", 20)
.style("fill", "orange");

legend.append("text")
.attr("x", 710)
.attr("y", 40)
.text("AverageCityMPG")
.style("font-weight", "bold")
.attr("fill", "orange");


// 添加 X 轴标题
svg.append("text")
.attr("class", "x-axis-title") // 可以为标题添加样式类
.attr("x", width / 2)          // 将标题放置在 X 轴的中点
.attr("y", height - margin.bottom + 25) // 将标题放置在 X 轴下方一段距离
.attr("text-anchor", "middle") // 使文本居中对齐
.text("City MPG(/Miles)")            // X 轴标题文本
.style("font-weight", "bold")
.attr("fill", "blue");        

// 添加 Y 轴标题
svg.append("text")
.attr("class", "y-axis-title") // 可以为标题添加样式类
//.attr("transform", "rotate(-90)") // 将标题旋转90度
.attr("x", 80 ) // 将标题的中心放置在 Y 轴的中点
.attr("y", 50) // 将标题放置在 Y 轴左侧一段距离
.attr("text-anchor", "middle") // 使文本居中对齐
.text("Car Makes")
.style("font-weight", "bold")
.attr("fill", "blue");;           // Y 轴标题文本

 
}

// 场景3：展示汽车发动机气缸数的分布情况
function scene3() {
    svg.selectAll("*").remove();
    const margin = {top: 20, right: 20, bottom: 30, left: 40};  
    const width = +svg.attr("width") - margin.left - margin.right;  
    const height = +svg.attr("height") - margin.top - margin.bottom;  
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);  


    // 假设 data 是你的数据  
    const x = d3.scaleLinear().range([0, width]).domain([0, 150]);  
    const y = d3.scaleLinear().range([height, 0]).domain([0, 150]);  


     // 创建轴生成器  
     const xAxis = d3.axisBottom(x)  
         .tickValues(d3.range(0, 151, 10)) // 设置刻度值，从0到150，每隔10一个  
         .tickFormat(d => d); // 格式化刻度标签  

     const yAxis = d3.axisLeft(y)  
         .tickValues(d3.range(0, 151, 10))  
         .tickFormat(d => d );  

     // 添加轴到SVG  
     g.append("g")  
         .attr("transform", `translate(0,${height})`)  
         .call(xAxis).attr("class", "bold");  

     g.append("g")  
         .call(yAxis).attr("class", "bold");  
      
    // 绘制圆点  
   // 为矩形创建元素  
g.selectAll("rect.shape")  
.data(data.filter(d => d.fuel !== 'Electricity'))  
.enter()  
.append("rect")  
.attr("class", "shape")  
.attr("width", 20)  
.attr("height", 20)  
.attr("x", d => x(d.highwayMPG) - 10)  
.attr("y", d => y(d.cityMPG) - 10)
.style("fill", d => {  
    // 如果点在等值线上方，使用蓝色；否则，使用橘色  
    return d.highwayMPG>d.cityMPG ? "blue" : "orange" 
})
.on("mouseover", function(event,d) {  
    d3.select(this).style("fill", "red"); // 使用.style() 来更改 CSS 样式  
    // 显示数据（这里只是示例，实际可能需要一个提示框）  
     // 更新tooltip的内容  
d3.select("#tooltip")  
.style("visibility", "visible")  
.html(`Car Make: ${d.make}<br>City MPG: ${d.cityMPG}<br>Fuel: ${d.fuel}<br>EngineCylinders: ${d.engineCylinders}<br>AverageHighwayMPG: ${d.highwayMPG}<br>AverageCityMPG: ${d.cityMPG}`)  
// 计算并设置tooltip的位置  
.style("left", (event.pageX) + "px")  
.style("top", (event.pageY - 28) + "px");  
})  
.on("mouseout", function(event,d) {  
    d3.select(this).style("fill", d.highwayMPG > d.cityMPG ? "blue" : "orange");
    d3.select("#tooltip").style("visibility", "hidden");  
});  

// 为圆形创建元素  
g.selectAll("circle.shape")  
.data(data.filter(d => d.fuel === 'Electricity'))  
.enter()  
.append("circle")  
.attr("class", "shape")  
.attr("cx", d => x(d.highwayMPG))  
.attr("cy", d => y(d.cityMPG))  
.attr("r", 10)
    .style("fill", d => {  
            // 如果点在等值线上方，使用蓝色；否则，使用橘色  
            return d.highwayMPG>d.cityMPG ? "blue" : "orange" 
        })
        .on("mouseover", function(event,d) {  
            d3.select(this).style("fill", "red"); // 使用.style() 来更改 CSS 样式  
            // 显示数据（这里只是示例，实际可能需要一个提示框）  
             // 更新tooltip的内容  
        d3.select("#tooltip")  
        .style("visibility", "visible")  
        .html(`Car Make: ${d.make}<br>City MPG: ${d.cityMPG}<br>Fuel: ${d.fuel}<br>EngineCylinders: ${d.engineCylinders}<br>AverageHighwayMPG: ${d.highwayMPG}<br>AverageCityMPG: ${d.cityMPG}`)  
        // 计算并设置tooltip的位置  
        .style("left", (event.pageX) + "px")  
        .style("top", (event.pageY - 28) + "px");  
        })  
        .on("mouseout", function(event,d) {  
            d3.select(this).style("fill", d.highwayMPG > d.cityMPG ? "blue" : "orange");
            d3.select("#tooltip").style("visibility", "hidden");  
        }); 

    g.append("line")  
        .attr("x1", 0)  
        .attr("y1", height)  
        .attr("x2", width)  
        .attr("y2", 0)  
        .style("stroke", "gray")  
        .style("stroke-dasharray", ("3, 3")); // 虚线样式 
      
                        // 添加图表标题
svg.append("text")
.attr("x", width / 2)
.attr("y", 40 )
.attr("text-anchor", "middle")
.style("font-size", "20px")
.style("font-weight", "bold")
.text("AveragecityMPG  VS AveragehighwayMPG of various car makes")
.attr("fill", "blue");



// 添加 X 轴标题
svg.append("text")
.attr("class", "x-axis-title") // 可以为标题添加样式类
.attr("x", width-70)          // 将标题放置在 X 轴的中点
.attr("y", height - margin.bottom + 80) // 将标题放置在 X 轴下方一段距离
.attr("text-anchor", "middle") // 使文本居中对齐
.text("Cityway MPG(/Miles)")            // X 轴标题文本
.style("font-weight", "bold")
.attr("fill", "blue");        

// 添加 Y 轴标题
svg.append("text")
.attr("class", "y-axis-title") // 可以为标题添加样式类
//.attr("transform", "rotate(-90)") // 将标题旋转90度
.attr("x", 100 ) // 将标题的中心放置在 Y 轴的中点
.attr("y", 15) // 将标题放置在 Y 轴左侧一段距离
.attr("text-anchor", "middle") // 使文本居中对齐
.text("Highway MPG(/Miles)")
.style("font-weight", "bold")
.attr("fill", "blue");           // Y 轴标题文本

    // 添加注释
    const annotations1 = [
        {
            note: {
                label: "highwayMPG>d.cityMPG ? blue : orange ",
                title: "Color Meaning"
            },
            x: 660,
            y: 260,
            dy: -30,
            dx: 50, 
          
        }
    ];

    const makeAnnotations1 = d3.annotation().annotations(annotations1);
    svg.append("g").call(makeAnnotations1);

    
      // 添加注释
      const annotations2 = [
        {
            note: {
                label: "The line representing where cityMPG equals highwayMPG",
                title: "Identity Line"
            },
            x: 360,
            y: 360,
            dy: -30,
            dx: 50, 
          
        }
        
    ];

    const makeAnnotations2 = d3.annotation().annotations(annotations2);
    svg.append("g").call(makeAnnotations2);


     // 添加注释
     const annotations3 = [
        {
            note: {
                label: "Rect:Fuel is not 'Electricity',Circle:Fuel is 'Electricity'",
                title: "Shape Meaning"
            },
            x: 260,
            y: 500,
            dy: -30,
            dx: 50, 
          
        }
    ];

    const makeAnnotations3 = d3.annotation().annotations(annotations3);
    svg.append("g").call(makeAnnotations3);
}

// 绑定按钮点击事件到相应的场景
d3.select("#scene1").on("click", scene1);
d3.select("#scene2").on("click", scene2);
d3.select("#scene3").on("click", scene3);
