// 
// 
// http://localhost:3000/lua/rest/v2/get/host/data.lua?ifid=1&host=192.168.1.127
// 
// 

// ---- TYPE
function apexc_chart(chart_type, chart_width='100%') {
	// global configuration
	// var chart_width = '100%' // int or str (with % or px)

	if (['donut', 'pie', 'radialbar'].indexOf(chart_type) >= 0)
		return {chart: {type: chart_type, width: chart_width}}
	
	// /lua/rest/v2/get/host/data.lua?ifid=1&host=192.168.1.127
	// this.update = function () {
	//	
	// }
}

// ---- THEME/PALETTE
function apexc_theme(palette=1, monochrome_shade='light') {
	if(palette[0] == '#' && !parseInt(palette))	// HEX color for monochrome palette
		return {theme: {monochrome: {enabled: true, color: palette, shadeTo: monochrome_shade, shadeIntensity: .7}}}
	else if(palette > 0 && palette < 11)	// default palette https://apexcharts.com/docs/options/theme#palette
		return {theme: {palette: `palette${palette}`}}
}

// ---- LEGEND
function apexc_legend(side='bottom') {
    if (['bottom', 'right', 'top', 'left'].indexOf(side) >= 0)
        return {legend: {position: side, offsetY: 0}}
    else if(side == 'none')
        return {legend: {show: false}}
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

	// update function here

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
			new_data = typeof(content) == "object" ? content : jQuery.parseJSON(content)

			if(new_data) {
				update_apexc(new_data.rsp, 'ndpi')
			}
		}
	});
}

function update_apexc(data_rsp, page_key) {
	// var new_data = data_rsp[page_key]
	console.log(data_rsp)
	data = new Array(data_rsp[page_key])
	updated_data = {series:[],labels:[]}

	datatest = {}

	// divides the array into two lists of data and labels
	data.forEach(element => {
		// console.log(element)
		for (var name in element){
			// updated_data['labels'].push(name)
			// updated_data['series'].push(element[name]['bytes.sent'])
		
			// datatest[name] = element[name]['bytes.sent']
			datatest[name] = element[name]['bytes.sent']
		}
	});

	console.log(datatest)

	//  -----------------------------------------------------
	// sorts in ascending order
	var sorted_labels = Object.keys(datatest).sort( function(keyA, keyB) {
		return datatest[keyA] < datatest[keyB];
	});

	// sorted_datatest = {series: Object.values(datatest).sort(), labels: sorted_labels, animate: false}
	sorted_datatest = {series: Object.values(datatest).sort((a, b) => b - a), labels: sorted_labels}
	console.log(sorted_datatest)

	top_app_proto_chart.updateOptions(sorted_datatest)
	//  -----------------------------------------------------

	// top_app_proto_chart.updateOptions({series: updated_data['series'], labels: updated_data['labels']})
}

getNewData(url_apex, data_apex)



////////////////////////// OLD LIB //////////////////////////

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
	var rsp = create_pie_chart(name, units);
	var arc_group = rsp[0];
	var donut = rsp[1];
	var totalValue = rsp[2];
	var totalUnits = rsp[3];
	var color = rsp[4];
	var tweenDuration = rsp[5];
	var arc = rsp[6];
	var label_group = rsp[7];
	var center_group = rsp[8];
	var r = rsp[9];
	var textOffset = rsp[10];

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

	var updateInterval = window.setInterval(update, refresh);

}

//////////////////////////////////////////////////////////////
///// PUBLIC FUNCTIONS ///////////////////////////////////////
//////////////////////////////////////////////////////////////

PieChart.prototype.setInterval = function (p_pieInterval) {
	this.pieInterval = p_pieInterval;
}

PieChart.prototype.setUrlParams = function (url_params) {
	this.url_params = url_params;
	this.forceUpdate();
}

PieChart.prototype.forceUpdate = function (url_params) {
	this.stopInterval();
	this.update();
	this.startInterval();
}

PieChart.prototype.stopInterval = function () {
	//disabled graph interval
	clearInterval(this.pieInterval);
}

PieChart.prototype.startInterval = function () {
	this.pieInterval = setInterval(this.update(), this.refresh)
}