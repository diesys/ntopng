# Using ApexCharts in ntopng with vanilla JS

This is page is incomplete and under development, 
a working page using pie apex charts can be found here `scripts/lua/host_details_apex.lua` (copy of `scripts/lua/host_details.lua`, wich includes [ApexCharts](https://apexcharts.com/docs) via CDN and `httpdocs/js/apexchart-wrapper.js`).

May be useful to see this together with the other charts, because many things are in common between pie and other king of charts

## basis for future documentation for apex-charts use
here are just some of the class functions and parameters (other are in the main wrapper `httpdocs/js/apexchart-wrapper_class.js`) and possible parameters (in future may be more conveniente to pass a custom JSON with the custom options needed for all ntop charts)

`type`:              `pie` | `donut` | `polarArea` | `radialbar` (with some problems now)
`theme(_)`:           `int` (1-10) | `string` (#hex_color)
`legend(_)`:          `bottom` | `top` | `left` | `right`
`label(_)`:           `true` | `false`
`suffix(_)`:          `string`
`selectFirsts(_, _)`: `{series:[],labels:[]}`, `int`