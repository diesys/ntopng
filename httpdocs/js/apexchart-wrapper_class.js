// Wrapper function
function do_pie(type, url_api, url_params, apex_custom_conf, refresh=2000) { // default 2s update
	// New class instance
	var pie = new aChart(type, {url: url_api, params: url_params}, apex_custom_conf);
	if (refresh)
		pie.setInterval(setInterval(function () { pie.update(); }, refresh));
	return pie;
}


// api_conf has url and parameters, apex_conf allows to use custom properties with apexchart
// new object builds the new dict config for apex and then loads data from api, self updates and return the obj value
function aChart(type, api_conf, apex_conf = {}) {
	console.log(type, api_conf, apex_conf)
	// type of chart (see apex-chart docs)
	this.type=type
	// custom palette because default ones have only 5 colors
	this.palette = {colors: ['#208fdb', '#2bca80', '#fa4a80', '#fec019', '#ff5520', '#a71da0', '#a0e300', '#204070']}
	// stroke default
	this.stroke = {stroke: {show: false}}
	// responsive breakpoints list (see apex-chart docs)
	this.breakpoints = [{
		breakpoint: 500, options: {chart: {width: "50%"}, legend: {show: false}},
	}]
	
	// creates the base configuration obj with some types selected and some default conf
	function chart(type) {
		if (['donut', 'pie', 'radialbar', 'polarArea'].indexOf(type) >= 0)
			return {chart: {type: type, width: '100%'},...this.stroke}
	} 
	// base conf
	this.apex_conf = chart(this.type)

	// legend position or presence
	function legend(side='bottom') {
		if (['bottom', 'right', 'top', 'left'].indexOf(side) >= 0)
			return {legend: {position: side, offsetY: 0}}
		else if(side == 'none')
			return {legend: {show: false}}
		else
			return {}
	}

	// sets show/hide labels
	function label(bool='true') {
		return {dataLabels: {enabled: bool == 'true'}}
	}

	// add suffix like "MB", "KB" for tooltips on mouseover
	function suffix(suffix) {
		return {tooltip: {y: {
			formatter: function(value) {
				return value + suffix
		}}}}
	}

	// theme-palette
	function theme(palette=1, monochrome_shade='light') {
		if(palette[0] == '#' && !parseInt(palette))	// HEX color for monochrome palette
			return {theme: {monochrome: {enabled: true, color: palette, shadeTo: monochrome_shade, shadeIntensity: .7}}}
		else if(palette > 0 && palette < 11)	// default palette https://apexcharts.com/docs/options/theme#palette
			return {theme: {palette: `palette${palette}`}}
	}
	
	// updates the chart getting new data from api
	this.update = function () {
		
	}

	// // builds the ApexChart configuration object for the new ApexChart object
	// this.apex_conf = {...chart(this.type),...this.stroke,...this.palette,...this.breakpoints}
	
	// RETURNS THE NEW OBJECT
	console.log(this.apex_conf)
	return new ApexCharts("#topApplicationProtocols", this.apex_conf)

	// test = {...chart_animation,...chart_label(),...chart_legend('top')}
	// chart = {...{series:[data]}, ...{series:[labels]}, ...chart_type('donut'), ...chart_label(), ...chart_legend_side(), ...chart_responsive}
}


// selects the first N items (if enough, MUST be ALREADY ordered) in Data and reduces the rest to "Others"
var selectFirsts = (data, n) => data.series.length <= n ? D : ({
	series: data.series.slice(0,n).concat(data.series.slice(n).reduce((x,y)=>parseFloat((x+y)))),
	labels: data.labels.slice(0,n).concat('Others')
})

function getNewData(chart_obj, api_url, vars_url, page_key) {
	$.ajax({type: 'GET', url: api_url, data: vars_url,
		success: function (content) {
			// parse data into an obj, if needed
			new_data = typeof(content) == "object" ? content : jQuery.parseJSON(content)
			// updates the chart with the new data
			if(new_data)
				update_apexc(chart_obj, new_data.rsp, page_key)
		}
	});
}

// needs some rewriting
function update_apexc(chart_obj, data_rsp, page_key) {
	if(['ndpi', 'ndpi_categories'].indexOf(page_key) >= 0) {
		data = new Array(data_rsp[page_key])
		updated_data = {series:[], labels:[]}
	} else { // now means "breed", in future will not be needed
		data = new Array(data_rsp['ndpi'])
		updated_data = {series:[], labels:[], breed:[]}
	}
	
	new_data = {}

	// divides the array into two lists of data and labels
	data.forEach(element => {
		for (var name in element) { // convert to kb and rounds
			new_data[name] = parseFloat((element[name]['bytes.sent'] / 1024).toFixed(2))
		}
	});

	// sort labels in ascending order (based on value)
	var sorted_labels = Object.keys(new_data).sort( function(keyA, keyB) {
		return new_data[keyA] < new_data[keyB];
	});

	// consruct and update the chart with the new data
	new_data = {series: Object.values(new_data).sort((a, b) => b - a), labels: sorted_labels}
	// keeps the first 6
	chart_obj.updateOptions(selectFirsts(new_data, 7))
}


///////////////////// OTHER possible params, needed? /////////////////////
// Currently NO ANIMATION DEFAULT
// const chart_animation = {
// 	animations: {
// 		enabled: true,
// 		easing: 'easein',
// 		speed: 200}
// }

// const chart_stroke = {
// 	stroke: {
// 		show: true,
// 		curve: 'smooth',
// 		width: 0,
// 	}
// }


////////////////////////// OLD LIB (part) //////////////////////////

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