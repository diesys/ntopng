// creating partial configuration for better custom use of apex charts api

const apexc_responsive = [{
	breakpoint: 480,
	options: {
	  chart: {
		width: 200},
	  legend: {
		show: false}
	}
}]

function apexc_chart(chart) {
	// some custom presets
	pie = {chart: {width: 380, type: 'pie'}}
	donut = {chart: {width: 380, type: 'donut'}}

	if(chart == 'donut')
		return donut
}

function apexc_legend(side='right', offset=0) {
	// some custom presets
	right_conf ={legend: {position: 'right', offsetY: offset}} 
	left_conf ={legend: {position: 'left', offsetY: offset}}

	if(side == 'right')
		return right_conf
	else if(side == 'left')
		return left_conf
}

function apexc_label(bool='true') {
	return {dataLabels: {enabled: bool == 'true'}}
}

//// unify objects to have a custom options each time
// example:
// chart = {...data_series, ...data_labels, 
// options	...apexc_chart('donut'), ...apexc_label(), ...apexc_legend(), ...apexc_responsive}


// Wrapper function
function do_pie(name, update_url, url_params, units, refresh) {
	var pie = new PieChart(name, update_url, url_params, units, refresh);

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

	// var pieData = [];
	// var oldPieData = [];
	// var filteredPieData = [];
	// var rsp = create_pie_chart(name, units);
	// var arc_group = rsp[0];
	// var donut = rsp[1];
	// var totalValue = rsp[2];
	// var totalUnits = rsp[3];
	// var color = rsp[4];
	// var tweenDuration = rsp[5];
	// var arc = rsp[6];
	// var label_group = rsp[7];
	// var center_group = rsp[8];
	// var r = rsp[9];
	// var textOffset = rsp[10];


	// to run each time data is generated
	this.update = function () {
		// console.log(this.name);
		// console.log(this.url_params);

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
					// update_pie_chart(parsed_content);
			}
		});
	}

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