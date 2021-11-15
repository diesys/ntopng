# Using ApexCharts in ntopng with vanilla JS

> WARNING! This is page is incomplete and under development, use for debug only! And is been developed for the community ed. only, some pro features may not work right now



A working page using pie apex can be found in `scripts/lua/host_details_apex.lua` (copy of `scripts/lua/host_details.lua`, wich includes [ApexCharts](https://apexcharts.com/docs) via CDN and `httpdocs/js/apexchart-wrapper.js`).

May be useful to see this together with the other charts, because many things are in common between pie and other king of charts

#### Basis for future chart use

Below there's a list of just some of the class functions (other are in the main wrapper `httpdocs/js/apexchart-wrapper_class.js`) and other possible parameters (in future may be more conveniente to pass a custom JSON with the custom options needed for all ntopng charts)

| Name                 | Possible options                                                        |
| -------------------- | ----------------------------------------------------------------------- |
| `type`               | `pie` \| `donut` \| `polarArea` \| `radialbar` (with some problems now) |
| `legend(_)`          | `bottom` \| `top` \| `left` \| `right`                                  |
| `theme(_)`           | `int` (1-10) \| `string` (#hex_color)                                   |
| `suffix(_)`          | `string`                                                                |
| `selectFirsts(_, _)` | `{series:[],labels:[]}`, `int`                                          |
| `label(_)`           | `true` \| `false`                                                       |



          