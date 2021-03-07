// @TODO: YOUR CODE HERE!
// X and Y axes
var chosen_x = "poverty";
var chosen_y = "healthcare";

// Create functions to update axes when labels clicked
function x_scale(data, chosen_x, chartWidth) {
    var x_linearscale = d3.scaleLinear()
        .domain([d3.min(data, d=> d[chosen_x]),
            d3.max(data, d => d[chosen_x])])
        .range([0, chartWidth]);
    return x_linearscale;
}

function render_x(new_x_scale, xAxis) {
    var bottom_Axis = d3.axisBottom(new_x_scale);
    xAxis.transition()
        .duration(500)
        .call(bottom_Axis);
    return xAxis;
}
//functions as above for the y axis
function y_scale(data, chosen_y, chartHeight) {
    var y_linearscale = d3.scaleLinear()
        .domain([d3.min(data, d=> d[chosen_y]),
            d3.max(data, d=> d[chosen_y])])
        .range([chartHeight, 0]);
    return y_linearscale;
}

function render_y(new_y_scale, yAxis) {
    var left_axis = d3.axisLeft(new_y_scale);
        yAxis.transition()
            .duration(500)
            .call(left_axis);
        return yAxis;
}
// function to transition to new circle groups
function render_circles(circle_group, new_x_scale, new_y_scale, chosen_x, chosen_y) {
    circle_group.transition()
        .duration(500)
        .attr("cx", d => new_x_scale(d[chosen_x]))
        .attr("cy", d => new_y_scale(d[chosen_y]));
    return circle_group;
}
// funtion to update text with a transition
function render_text(circletext_grp, new_x_scale, new_y_scale, chosen_x, chosen_y) {
    circletext_grp.transition()
        .duration(500)
        .attr("x", d=> new_x_scale(d[chosen_x]))
        .attr("y", d=> new_y_scale(d[chosen_y]));
    return circletext_grp;
}

// update circles with new tooltip
function update_tooltip(chosen_x, chosen_y, circle_group, text_group) {
    // if/else for chosen axes
    if (chosen_x === "poverty") {
        var X_label = "Poverty: ";
    } else if (chosen_x === "income") {
        var X_label = "Median Income: "
    } else {
        var X_label = "Age: "
    }
    //repeat for y axis
    if (chosen_y === "healthcare") {
        var Y_label = "No Healthcare: ";
    } else if (chosen_y === "smokes") {
        var Y_label = "Smokers: "
    } else {var Y_label = "Obesity: "}
    // set up tooltip
    var tool_tip = d3.tip()
        .offset([100, -50])
        .attr("class", "d3-tip")
        .html(function(d) {
            if (chosen_x === "age") {
                return (`${d.state}<hr>${X_label}${d[chosen_x]}<br>${Y_label}${d[chosen_y]}%`);
                }
                else if (chosen_x === "income") {
                return (`${d.state}<hr>${X_label}$${d[chosen_x]}<br>${Y_label}${d[chosen_y]}%`)
                }
                else {
                return (`${d.state}<hr>${X_label}${d[chosen_x]}%<br>${Y_label}${d[chosen_y]}%`)
                }
        });
        circle_group.call(toolTip);

        circle_group
            .on("mouseover", function(data) {toolTip.show(data, this);})
            .on("mouseout", function(data) {toolTip.hide(data);});
        text_group
            .on("mouseover", function(data) {toolTip.show(data, this);})
            .on("mouseout", function(data) {tooltip.hide(data);});
        return circle_group;
}
function make_responsive() {
    var svg_area = d3.select("#scatter").select("svg");
    // clear out the svg
    if (!svg_area.empty()) {svg_area.remove();}
    //set parameters
    var svg_height = window.innerHeight/1.2;
    var svg_width = window.innerWidth/1.7;
    var margins = {
        top:50,
        right: 50,
        bottom: 100,
        left: 80
    };
    // set chart area to account for margins
    var chart_height = svg_height - margins.top - margins.bottom;
    var chart_width = svg_width - margins.left - margins.right;
    // svg wrapper with margins
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height);

    var chart_group = svg.append("g").attr("transform", `translate(${margins.left}, ${margins.top})`);
    d3.csv("assets/data/data.csv").then(function(demo_data, err) {
        if (err) throw err;
        demo_data.forEach(function(data) {
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.healthcare = +data.healthcare;
            data.income = +data.income;
            data.smokes = +data.smokes;
            data.obesity = +data.obesity;
        });
        // set the scale for axes
        var x_linear_scale = xScale(demo_data, chosen_x, chart_width);
        var y_linear_scale = yScale(demo_data, chosen_y, chart_height);
        // set the axes initial state
        var bottom_axis = d3.axisBottom(x_linear_scale);
        var left_axis = d3.axisLeft(y_linear_scale);
        // append the x and y axes to the svg
        var x_axis = chart_group.append("g")
            .attr("transform", `translate(0, ${chart_height})`)
            .call(bottom_axis);
        var y_axis = chart_group.append("g").call(left_axis);
        // set up the circle markers
        var circle_group = chart_group.selectAll("circle").data(demo_data);
        var bind_data = circle_group.enter();
        // make the circles and text
        var circles = bind_data.append("circle")
            .attr("cx", d=> x_linear_scale(d[chosen_x]))
            .attr("cy", d=> y_linear_scale(d[chosen_y]))
            .attr("r", 13)
            .classed("stateCircle, true");

        var circle_text = elemEnter.append("text")
            .attr("x", d=> x_linear_scale(d[chosen_x]))
            .attr("y", d=> y_linear_scale(d[chosen_y]))
            .attr("dy", ".35em")
            .text(d => d.abbr)
            .classed("stateText", true);
        // update circle group
        var circle_group = update_tooltip(chosen_x, chosen_y, circles, circle_text);
        // create label groups for x axis
        var x_label_group = chart_group.append("g")
            .attr("transform", `translate(${chart_width/2}, ${chart_height + 20})`);
        var poverty_label = x_label_group.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .classed("active", true)
            .text("% In Poverty");
        var age_label = x_label_group.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age")
            .classed("inactive", true)
            .text("Median Age");
        var income_label = x_label_group.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income")
            .classed("inactive", true)
            .text("Median Household Income");
        // repeat above steps for y axis labels
        var y_label_group = chart_group.append("g")
            .attr("transform", "rotate(-90)");
        var health_label = y_label_group.append("text")
            .attr("x", 0 - (chart_height / 2))
            .attr("y", 40 - margins.left)
            .attr("dy", "1em")
            .attr("value", "healthcare")
            .classed("active", true)
            .text("% Without Healthcare");
        var smokes_label = y_label_group.append("text")
            .attr("x", 0 - (chart_height / 2))
            .attr("y", 20 - margins.left)
            .attr("dy", "1em")
            .attr("value", "smokes")
            .classed("inactive", true)
            .text("% Smokers");
        var obese_label = y_label_group.append("text")
        .attr("x", 0 - (chart_height / 2))
        .attr("y", 0 - margins.left)
        .attr("dy", "1em")
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("% Obese");
    // listener for x axis
        x_label_group.selectAll("text")
            .on("click", function() {
                chosen_x = d3.select(this).attr("value");
                x_linear_scale = x_scale(demo_data, chosen_x, chart_width);
                xAxis = render_x(x_linear_scale, xAxis);
                //switch active labels
                if (chosen_x === "poverty") {
                    poverty_label
                        .classed("active", true)
                        .classed("inactive", false);
                    age_label
                        .classed("active", false)
                        .classed("inactive", true);
                    income_label
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosen_x === "age") {
                    poverty_label
                        .classed("active", false)
                        .classed("inactive", true);
                    age_label
                        .classed("active", true)
                        .classed("inactive", false);
                    income_label
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    poverty_label
                        .classed("active", false)
                        .classed("inactive", true);
                    age_label
                        .classed("active", false)
                        .classed("inactive", true);
                    income_label
                        .classed("active", true)
                        .classed("inactive", false);
                }
                // update circles
                circles = render_circles(circle_group, x_linear_scale, y_linear_scale, chosen_x, chosen_y);
                circle_group = update_tooltip(chosen_x, chosen_y, circles, circle_text);
                circle_text = render_text(circle_text, x_linear_scale, y_linear_scale, chosen_x, chosen_y);
            });
    // listener for y axis
        y_label_group.selectAll("text")
            .on("click", function() {
                chosen_y = d3.select(this).attr("value");
                y_linear_scale = y_scale(demo_data, chosen_y, chart_height);
                yAxis = render_y(y_linear_scale, yAxis);
                // change active axis label
                if (chosen_y === "healthcare") {
                    health_label
                        .classed("active", true)
                        .classed("inactive", false);
                    age_label
                        .classed("active", false)
                        .classed("inactive", true);
                }
            })

    });
}
