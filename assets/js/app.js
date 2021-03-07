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
function update_tooltip(chosen_x, chosen_y)
