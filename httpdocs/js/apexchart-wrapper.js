function NtopApexChart() {
	// /lua/rest/v2/get/host/data.lua?ifid=1&host=192.168.1.127
	// this.update = function () {
	//	
	// }
}

// ---- TYPE
function apexc_chart(chart_type, chart_width='100%') {
	if (['donut', 'pie', 'radialbar'].indexOf(chart_type) >= 0)
		return {chart: {type: chart_type, width: chart_width}}
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
	breakpoint: 500,
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
	$.ajax({type: 'GET', url: url, data: data,
		success: function (content) {
			// parse the data if needed
			new_data = typeof(content) == "object" ? content : jQuery.parseJSON(content)
			// updates the chart with the new data
			if(new_data)
				update_apexc(new_data.rsp, 'ndpi')
		}
	});
}

function update_apexc(data_rsp, page_key) {
	data = new Array(data_rsp[page_key])
	updated_data = {series:[],labels:[]}
	// console.log(data_rsp)
	// console.log(data)

	new_data = {}

	// divides the array into two lists of data and labels
	data.forEach(element => {
		for (var name in element)
			new_data[name] = element[name]['bytes.sent']
	});

	// sorts in ascending order
	var sorted_labels = Object.keys(new_data).sort( function(keyA, keyB) {
		return new_data[keyA] < new_data[keyB];
	});

	new_data = {series: Object.values(new_data).sort((a, b) => b - a), labels: sorted_labels}

	top_app_proto_chart.updateOptions(new_data)

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