function NtopApexChart(type, theme, legend, label, data, api_url) {
	// FORSE NE SERVONO MENO? O SI PASSA DIRETTAMENTE IL JSON CONFIG?

	//// unify objects to have a custom options each time as
	// chart = {...{series:[data]}, ...{series:[labels]}, ...chart_type('donut'), ...chart_label(), ...chart_legend_side(), ...chart_responsive}

	// /lua/rest/v2/get/host/data.lua?ifid=1&host=192.168.1.127
	// this.update = function () {
	//	
	// }
}

// responsive breakpoints
const chart_responsive = [{
	breakpoint: 500, options: {chart: {width: "50%"}, legend: {show: false}},
}]

// ---- TYPE
function chart_type(chart_type, chart_width='100%') {
	if (['donut', 'pie', 'radialbar', 'polarArea'].indexOf(chart_type) >= 0)
		return {chart: {type: chart_type, width: chart_width}, stroke: {show: false}, colors: chart_colors, ...chart_suffix(' KB')}
}

// custom theme, because palette has only 5 colors
const chart_colors = ['#208fdb', '#2bca80', '#fa4a80', '#fec019', '#ff5520', '#a71da0', '#a0e300', '#204070']

// ---- THEME/PALETTE
function chart_theme(palette=1, monochrome_shade='light') {
	if(palette[0] == '#' && !parseInt(palette))	// HEX color for monochrome palette
		return {theme: {monochrome: {enabled: true, color: palette, shadeTo: monochrome_shade, shadeIntensity: .7}}}
	else if(palette > 0 && palette < 11)	// default palette https://apexcharts.com/docs/options/theme#palette
		return {theme: {palette: `palette${palette}`}}
}

// ---- FORMATTER (tooltips) to add a suffix like "MB", "KB", etc
function chart_suffix(suffix) {
	return {tooltip: {y: {
				formatter: function(value) {
					return value + suffix
			}}}}
}

// ---- LEGEND
function chart_legend(side='bottom') {
    if (['bottom', 'right', 'top', 'left'].indexOf(side) >= 0)
        return {legend: {position: side, offsetY: 0}}
    else if(side == 'none')
        return {legend: {show: false}}
}

function chart_label(bool='true') {
	return {dataLabels: {enabled: bool == 'true'}}
}

const chart_animation = {
	// Currently NO ANIMATION DEFAULT
	animations: {
		enabled: true,
		easing: 'easein',
		speed: 200,
		// animateGradually: {
		// 	enabled: false,
		// 	delay: 0
		// },
		// dynamicAnimation: {
		// 	enabled: false,
		// 	speed: 0
		// }
	}
}

const chart_stroke = {
	stroke: {
		show: true,
		curve: 'smooth',
		width: 0,
	}
}


// Wrapper & self-update function
function do_pie(name, update_url, url_params, units, refresh) {
	// var pie = new PieChart(name, update_url, url_params, units, refresh);
	if (refresh)
		pie.setInterval(setInterval(function () { pie.update(); }, refresh));

	// update function here

	// Return new class instance, with
	return pie;
}

function getNewData(chart_obj, api_url, vars_url, page_key) {
	$.ajax({type: 'GET', url: api_url, data: vars_url,
		success: function (content) {
			// console.log(api_url, vars_url, content)
			// parse data into an obj, if needed
			new_data = typeof(content) == "object" ? content : jQuery.parseJSON(content)
			// updates the chart with the new data
			if(new_data)
				update_apexc(chart_obj, new_data.rsp, page_key)
		}
	});
}

function update_apexc(chart_obj, data_rsp, page_key) {
	// DAFARE MEGLIO E AGGIUNGERE il limite al numero di cose nel grafico
	// coi metodi interni, cosi ha gia' l'url giusto coi parametri giusti...

	if(['ndpi', 'ndpi_categories'].indexOf(page_key) >= 0) {
		data = new Array(data_rsp[page_key])
		updated_data = {series:[], labels:[]}
	} else { // now means "breed", in future will not be needed
		data = new Array(data_rsp['ndpi'])
		updated_data = {series:[], labels:[], breed:[]}
	}
	
	// console.log(data_rsp)
	// console.log(data)

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
	chart_obj.updateOptions({series: Object.values(new_data).sort((a, b) => b - a), labels: sorted_labels})

}


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