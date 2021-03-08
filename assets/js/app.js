// initial X and Y values
var chosen_x_axis = "poverty";
var chosen_y_axis = "healthcare";
// make sure axes scale properly with new data selections
function xScale(data, chosen_x_axis, chartWidth) {

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosen_x_axis]) * .8,
        d3.max(data, d => d[chosen_x_axis]) * 1.2])
        .range([0, chartWidth]);
    return xLinearScale;
}
// change x axis when a label is clicked
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(500)
        .call(bottomAxis);
    return xAxis;
}
// make sure axes scale properly with new data selections
function yScale(data, chosen_y_axis, chartHeight) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosen_y_axis]) * .8,
        d3.max(data, d => d[chosen_y_axis]) * 1.2])
        .range([chartHeight, 0]);
    return yLinearScale;
}
// change y axis when a label is clicked
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(500)
        .call(leftAxis);
    return yAxis;
}
// update text for new circle values
function renderText(circletextGroup, newXScale, newYScale, chosen_x_axis, chosen_y_axis) {
    circletextGroup.transition()
        .duration(500)
        .attr("x", d => newXScale(d[chosen_x_axis]))
        .attr("y", d => newYScale(d[chosen_y_axis]));
    return circletextGroup;
}
// transition between circles for different data variables
function renderCircles(circlesGroup, newXScale, newYScale, chosen_x_axis, chosen_y_axis) {
    circlesGroup.transition()
        .duration(500)
        .attr("cx", d => newXScale(d[chosen_x_axis]))
        .attr("cy", d => newYScale(d[chosen_y_axis]));
    return circlesGroup;
}
// change tooltips depending on selected values
function updateToolTip(chosen_x_axis, chosen_y_axis, circlesGroup, textGroup) {
    if (chosen_x_axis === "poverty") {
        var xlabel = "Poverty: ";
    } else if (chosen_x_axis === "income") {
        var xlabel = "Median Income: "
    } else {
        var xlabel = "Age: "
    }

    if (chosen_y_axis === "healthcare") {
        var ylabel = "Lacks Healthcare: ";
    } else if (chosen_y_axis === "smokes") {
        var ylabel = "Smokers: "
    } else {
        var ylabel = "Obesity: "
    }
    // set up the tooltip
    var toolTip = d3.tip()
        .offset([120, -60])
        .attr("class", "d3-tip")
        .html(function (d) {
            if (chosen_x_axis === "age") {
                return (`${d.state}<hr>${xlabel} ${d[chosen_x_axis]}<br>${ylabel}${d[chosen_y_axis]}%`);
            } else if (chosen_x_axis !== "poverty" && chosen_x_axis !== "age") {
                return (`${d.state}<hr>${xlabel}$${d[chosen_x_axis]}<br>${ylabel}${d[chosen_y_axis]}%`);
            } else {
                return (`${d.state}<hr>${xlabel}${d[chosen_x_axis]}%<br>${ylabel}${d[chosen_y_axis]}%`);
            }
        });
    circlesGroup.call(toolTip);


    // popups when mouse is over cursor
    circlesGroup
        .on("mouseover", function (data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function (data) {
            toolTip.hide(data);
        });

    textGroup
        .on("mouseover", function (data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function (data) {
            toolTip.hide(data);
        });
    return circlesGroup;
}
function makeResponsive() {
    var svgArea = d3.select("#scatter").select("svg");
    // reset the svg area
    if (!svgArea.empty()) {
        svgArea.remove();
    }
    // set the svg dimensions and margins
    var svgHeight = window.innerHeight / 1.2;
    var svgWidth = window.innerWidth / 1.7;
    var margin = {
        top: 50,
        right: 50,
        bottom: 100,
        left: 80
    };
    // account for margins in chart height and width
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;
    // Make an svg wrapper to hold the charts
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    // append svg group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    d3.csv("assets/data/data.csv").then(function (demoData, err) {
        if (err) throw err;
        // parse the data.
        demoData.forEach(function (data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.income = +data.income;
            data.obesity = data.obesity;
        });
        // create linear scales for axes
        var yLinearScale = yScale(demoData, chosen_y_axis, chartHeight);
        var xLinearScale = xScale(demoData, chosen_x_axis, chartWidth);        
        // create initial axis functions
        var leftAxis = d3.axisLeft(yLinearScale);
        var bottomAxis = d3.axisBottom(xLinearScale);        
        // append the x and y axes
        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
        var yAxis = chartGroup.append("g")
            .call(leftAxis);
        // set the data for circles 
        var circlesGroup = chartGroup.selectAll("circle")
            .data(demoData);
        // Bind data
        var elem_Enter = circlesGroup.enter();
        // Create circles
        var circle = elem_Enter.append("circle")
            .attr("cx", d => xLinearScale(d[chosen_x_axis]))
            .attr("cy", d => yLinearScale(d[chosen_y_axis]))
            .attr("r", 15)
            .classed("stateCircle", true);
        // Create circle text
        var circleText = elem_Enter.append("text")
            .attr("x", d => xLinearScale(d[chosen_x_axis]))
            .attr("y", d => yLinearScale(d[chosen_y_axis]))
            .attr("dy", ".35em")
            .text(d => d.abbr)
            .classed("stateText", true);
        // Update tool tip function above csv import
        var circlesGroup = updateToolTip(chosen_x_axis, chosen_y_axis, circle, circleText);
        // Add x label groups and labels
        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
        var povertyLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("In Poverty (%)");
        var incomeLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Household Income (Median)");
        var ageLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");
        // Add y labels group and labels
        var yLabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)");
        var healthcareLabel = yLabelsGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 40 - margin.left)
            .attr("dy", "1em")
            .attr("value", "healthcare")
            .classed("active", true)
            .text("Lacks Healthcare (%)");
        var smokesLabel = yLabelsGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 20 - margin.left)
            .attr("dy", "1em")
            .attr("value", "smokes")
            .classed("inactive", true)
            .text("Smokes (%)");
        var obeseLabel = yLabelsGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 0 - margin.left)
            .attr("dy", "1em")
            .attr("value", "obesity")
            .classed("inactive", true)
            .text("Obese (%)");
        // Listen for x axis label changes
        xLabelsGroup.selectAll("text")
            .on("click", function () {
                // Update the Y axis and scale it properly.
                chosen_x_axis = d3.select(this).attr("value");
                xLinearScale = xScale(demoData, chosen_x_axis, chartWidth);
                xAxis = renderXAxes(xLinearScale, xAxis);
                // Makes sure that only the selected Y axis value is active and set other two as inactive.
                if (chosen_x_axis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosen_x_axis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                // Update circles with new x values.
                circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosen_x_axis, chosen_y_axis);
                // Update tool tips with new info.
                circlesGroup = updateToolTip(chosen_x_axis, chosen_y_axis, circle, circleText);
                // Update circles text with new values.
                circleText = renderText(circleText, xLinearScale, yLinearScale, chosen_x_axis, chosen_y_axis);
            });
        // Y Labels event listener.
        yLabelsGroup.selectAll("text")
            .on("click", function () {
                // Update the Y axis and scale it properly.
                chosen_y_axis = d3.select(this).attr("value");
                yLinearScale = yScale(demoData, chosen_y_axis, chartHeight);
                yAxis = renderYAxes(yLinearScale, yAxis);
                // Makes sure that only the selected Y axis value is active and set other two as inactive.
                if (chosen_y_axis === "healthcare") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosen_y_axis === "smokes") {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                // Update markers and popups with new info when selection is changed.
                circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosen_x_axis, chosen_y_axis);
                circleText = renderText(circleText, xLinearScale, yLinearScale, chosen_x_axis, chosen_y_axis);
                circlesGroup = updateToolTip(chosen_x_axis, chosen_y_axis, circle, circleText);
            });
    // log errors in the console. Very helpful for debugging!
    }).catch(function (err) {
        console.log(err);
    });
}
makeResponsive();
// Resize the plot to fit the window if window size changes.
d3.select(window).on("resize", makeResponsive);