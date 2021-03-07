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
            .on("mouseover", function(data) {toolTip.show(data);})
            .on("mouseout", function(data) {toolTip.hide(data);});
        text_group
            .on("mouseover", function(data) {toolTip.show(data);})
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

}
