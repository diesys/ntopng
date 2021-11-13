// 
// 
// http://localhost:3000/lua/rest/v2/get/host/data.lua?ifid=1&host=192.168.1.127
// 
// 

// Partial configurations/functions for cleaner custom use of apexcharts api
function apexc_chart(chart) {
	// global configuration
	var chart_width = '100%' // int or str (with % or px)


	// some custom presets
	var pie_conf = {chart: {type: 'pie', width: chart_width}}
	var donut_conf = {chart: {type: 'donut', width: chart_width}}


	if(chart == 'donut')
		return donut_conf
	else if(chart == 'pie')
		return pie_conf


	// /lua/rest/v2/get/host/data.lua?ifid=1&host=192.168.1.127
	// this.update = function () {
	// 	// console.log(this.name);
	// 	// console.log(this.url_params);
	// 	$.ajax({
	// 		type: 'GET',
	// 		url: this.update_url,
	// 		data: this.url_params,
	// 		success: function (content) {
	// 			let parsed_content;
	// 			if (typeof (content) == "object")
	// 				parsed_content = content;
	// 			else if (typeof (content) == "string")
	// 				parsed_content = jQuery.parseJSON(content);

	// 			if (parsed_content)
	// 				update_pie_chart(parsed_content);
	// 		}
	// 	});
	// }
}

function apexc_theme(palette=3) {
	// using a HEX color for monochrome palette, the check maybe too simple (#0000000, may give an error)?
	if(palette[0] == '#')
		var palette_conf = {theme: {monochrome: {enabled: true, color: palette, shadeTo: 'dark', shadeIntensity: .7}}}
	// default palettes https://apexcharts.com/docs/options/theme#palette
	else if(palette > 0 && palette < 11)
		var palette_conf = {theme: {palette: 'palette'+palette }}
	else
		var palette_conf = {theme: {palette: 'palette3' }}

	return palette_conf
}

function apexc_legend(side='right') {
	// global configuration
	var legend_offsetY = 0
	
	// some custom presets
	var top_conf = {legend: {position: 'top', offsetY: legend_offsetY}} 
	var bottom_conf = {legend: {position: 'bottom', offsetY: legend_offsetY}} 
	var right_conf = {legend: {position: 'right', offsetY: legend_offsetY}} 
	var left_conf = {legend: {position: 'left', offsetY: legend_offsetY}}
	var none_conf = {legend: {show: false, offsetY: legend_offsetY}}

	if(side == 'right')
		return right_conf
	else if(side == 'left')
		return left_conf
	else if(side == 'bottom')
		return bottom_conf
	else if(side == 'top')
		return top_conf
	else if(side == 'none')
		return none_conf
}

function apexc_label(bool='true') {
	return {dataLabels: {enabled: bool == 'true'}}
}

const apexc_responsive = [{
	breakpoint: 480,
	options: {chart: {width: 200}, legend: {show: false}}
}]


//// unify objects to have a custom options each time as
// chart = {...{series:[data]}, ...{series:[labels]}, ...apexc_chart('donut'), ...apexc_label(), ...apexc_legend_side(), ...apexc_responsive}


// Wrapper & self-update function
function do_pie(name, update_url, url_params, units, refresh) {
	// var pie = new PieChart(name, update_url, url_params, units, refresh);
	if (refresh)
		pie.setInterval(setInterval(function () { pie.update(); }, refresh));

	// update with jquery from external json, example


	// Return new class instance, with
	return pie;
}


var url_apex='/lua/rest/v2/get/host/data.lua'
var data_apex={ifid: '1', host: '192.168.1.127'}

function getNewData(url, data) {
	$.ajax({
		type: 'GET',
		url: url,
		data: data,
		success: function (content) {
			if (typeof (content) == "object"){
				new_data = content;
			} else if (typeof (content) == "string") {
				new_data = jQuery.parseJSON(content);
			}

			if (new_data) {
				update_apexc(new_data.rsp, 'ndpi')
				// console.log(new_data.rsp.ndpi)	
			}
		}
	});
}

function update_apexc(data_rsp, page_key) {
	// var new_data = data_rsp[page_key]
	data = new Array(data_rsp[page_key])
	updated_data = {series:[],labels:[]}

	datatest = {}

	// divides the array into two lists of data and labels
	data.forEach(element => {
		// console.log(element)
		for (var name in element){
			// updated_data['labels'].push(name)
			// updated_data['series'].push(element[name]['bytes.sent'])

			datatest[name] = element[name]['bytes.sent']
		}
	});

	console.log(datatest)

	//  -----------------------------------------------------
	// VA CONTROLLATA MEGLIO NON FUNZIONA E POI ANDREBBE FATTA ASSIEME ALL'ORDINAMENTO
	// sorts in ascending order
	var sorted_labels = Object.keys(datatest).sort( function(keyA, keyB) {
		return datatest[keyA] - datatest[keyB];
	}); // returns ['confirm', 'delete', 'cancel']

	sorted_datatest = {series: Object.values(datatest).sort(), labels: sorted_labels}
	console.log(sorted_datatest)

	top_app_proto_chart.updateOptions(sorted_datatest)
	//  -----------------------------------------------------

	// top_app_proto_chart.updateOptions({series: updated_data['series'], labels: updated_data['labels']})
}

getNewData(url_apex, data_apex)

function PieChart(name, update_url, url_params, units, refresh) {
	// Add object properties like this
	this.name = name;
	this.update_url = update_url;
	this.url_params = url_params;
	this.units = units;
	this.refresh = refresh;
	this.pieInterval;

	var pieData = [];
	var oldPieData = [];
	var filteredPieData = [];
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
		$.ajax({
			type: 'GET',
			url: this.update_url,
			data: this.url_params,
			success: function (content) {
				let parsed_content;
				// console.log(content)

				if (typeof (content) == "object")
					parsed_content = content;
				else if (typeof (content) == "string")
					parsed_content = jQuery.parseJSON(content);
	
				if (parsed_content)
					console.log(parsed_content)
					// UPDATE CHART HERE
			}
		});
	}

	// Needed to draw the pie immediately
	this.update();

	// var updateInterval = window.setInterval(update, refresh);
	function compare_by_label(a, b) {
		if (a.label < b.label) {
			return -1;
		} else if (a.label > b.label) {
			return 1;
		} else {
			return 0;
		}
	}
}

//////////////////////////////////////////////////////////////
///// PUBLIC FUNCTIONS ///////////////////////////////////////
//////////////////////////////////////////////////////////////

PieChart.prototype.setInterval = function (p_pieInterval) {
	this.pieInterval = p_pieInterval;
}

// PieChart.prototype.setUrlParams = function (url_params) {
// 	this.url_params = url_params;
// 	this.forceUpdate();
// }

// PieChart.prototype.forceUpdate = function (url_params) {
// 	this.stopInterval();
// 	this.update();
// 	this.startInterval();
// }

// PieChart.prototype.stopInterval = function () {
// 	//disabled graph interval
// 	clearInterval(this.pieInterval);
// }

// PieChart.prototype.startInterval = function () {
// 	this.pieInterval = setInterval(this.update(), this.refresh)
// }