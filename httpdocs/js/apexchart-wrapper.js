// Partial configurations/functions for cleaner custom use of apexcharts api
function apexc_chart(chart) {
	// global configuration
	chart_conf = {chart: {width: 380}}

	// some custom presets
	pie = {chart: {type: 'pie'}}
	donut = {chart: {type: 'donut'}}

	if(chart == 'donut')
		return {...chart_conf,...donut}
	else if(chart == 'pie')
		return {...chart_conf,...pie}
}

const apexc_responsive = [{
	breakpoint: 480,
	options: {
	  chart: {
		width: 200},
	  legend: {
		show: false}
	}
}]

function apexc_theme(palette='3') {
	// using a HEX color for monochrome palette, the check maybe too simple?
	if(palette[0] == '#' && palette.lenght < 8)
		palette_conf = {theme: {monochrome: {enabled: true, color: palette, shadeTo: 'light', shadeIntensity: 0.5}}}
	// default palettes from 1 -> 10: https://apexcharts.com/docs/options/theme#palette
	else if(palette > 0 && palette < 11)
		palette_conf = {theme: {palette: 'palette'+palette }}
	else
		palette_conf = {theme: {palette: 'palette3' }}

	return palette_conf
}

function apexc_legend(side='right') {
	// global configuration
	legend_conf = {legend: {offsetY: 0}}

	// some custom presets
	right_conf = {legend: {position: 'right'}} 
	left_conf = {legend: {position: 'left'}}
	none_conf = {legend: {show: false}}

	if(side == 'right')
		return {...legend_conf,...right_conf}
	else if(side == 'left')
		return {...legend_conf,...left_conf}
	else if(side == 'none')
		return {...legend_conf,...none_conf}
}

function apexc_label(bool='true') {
	return {dataLabels: {enabled: bool == 'true'}}
}


//// unify objects to have a custom options each time as
// chart = {...{series:[data]}, ...{series:[labels]}, ...apexc_chart('donut'), ...apexc_label(), ...apexc_legend_side(), ...apexc_responsive}


// Wrapper & self-update callback function
function do_pie(name, update_url, url_params, units, refresh) {
	var pie = new PieChart(name, update_url, url_params, units, refresh);

	// update with jquery from external json, example
	// var url = 'http://my-json-server.typicode.com/apexcharts/apexcharts.js/yearly';
	// $.getJSON(url, function(response) {
	// 	chart.updateSeries([{
	// 		name: 'nome',
	// 		data: response
	// 	}])
	// });

	// if (refresh)
		// pie.setInterval(setInterval(function () { pie.update(); }, refresh));

	// Return new class instance, with
	return pie;
}

function PieChart(name, update_url, url_params, units, refresh) {
	// Add object properties like this
	this.name = name;
	this.update_url = update_url;
	this.url_params = url_params;
	this.units = units;
	this.refresh = refresh;
	this.pieInterval;

	// to run each time data is generated
	this.update = function () {
		$.ajax({
			type: 'GET',
			url: this.update_url,
			data: this.url_params,
			success: function (content) {
				let parsed_content;

				if (typeof (content) == "object")
					parsed_content = content;
				else if (typeof (content) == "string")
					parsed_content = jQuery.parseJSON(content);
	
				if (parsed_content)
					console.log(parsed_content.rsp)
					// UPDATE CHART HERE
			}
		});
	}

	// first update
	this.update();
}

// ///////////////////////////////////////////////////////////
// // PUBLIC FUNCIONTS ////////////////////////////////////
// ///////////////////////////////////////////////////////////


// PieChart.prototype.setUrlParams = function (url_params) {
// 	this.url_params = url_params;
// 	this.forceUpdate();
// }

// PieChart.prototype.forceUpdate = function (url_params) {
// 	this.stopInterval();
// 	this.update();
// 	this.startInterval();
// }

PieChart.prototype.setInterval = function (p_pieInterval) {
	this.pieInterval = p_pieInterval;
}

// PieChart.prototype.stopInterval = function () {
// 	//disabled graph interval
// 	clearInterval(this.pieInterval);
// }

// PieChart.prototype.startInterval = function () {
// 	this.pieInterval = setInterval(this.update(), this.refresh)
// }