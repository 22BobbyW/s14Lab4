/**
 * @class Donut
 */
class Donut
{
    //vars
    data_bins = [];
    keys = ['Java', 'Php', 'Python', 'Cpp', 'Javascript', 'Other'];
    colors = null;

    // Elements
    svg = null;
    g = null;

    // Configs
    svgW = 300;
    svgH = 300;
    radius = 150;
    inner = 100;
    gMargin = {top: 10, right: 10, bottom: 10, left: 10};
    gW = (this.svgW - (this.gMargin.right + this.gMargin.left)) / 2;
    gH = (this.svgH - (this.gMargin.top + this.gMargin.bottom)) / 2;

    //tools
    pie = d3.pie();
    arc = d3.arc()
        .innerRadius(this.inner)
        .outerRadius(this.radius);
    color = d3.scaleOrdinal(['#4daf5a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c', '#3fb4bf']);

    /*
    Constructor
     */
    constructor(_data, _target)
    {
        // Assign parameters as object fields
        this.data = _data;
        this.target = _target;

        // Now init
        this.init();
    }

    /** @function init()
     * Perform one-time setup function
     *
     * @returns void
     */
    init()
    {
        // Define this vis
        const vis = this;

        // Set up the svg/g work space
        vis.svg = d3.select(`#${vis.target}`)
            .append('svg')
            .attr('width', vis.svgW)
            .attr('height', vis.svgH);
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.svgW/2}px, ${vis.svgH/2}px)`);
        vis.g.append('text')
            .attr('class', 'label')
            .text('Hover Over')
            .attr('text-anchor', 'middle');

        // Now wrangle
        vis.wrangle();
    }

    /** @function wrangle()
     * Preps data for vis
     *
     * @returns void
     */
    wrangle()
    {
        // Define this vis
        const vis = this;

        //Map the languages
        const temp = vis.data.map(d => d.prog_lang);
        const languageMap = [0, 0, 0, 0, 0, 0]
        temp.forEach(add);

        function add(value)
        {
            if(value == ('java'))
            {
                languageMap[0]++;
            }
            else if(value == ('php'))
            {
                languageMap[1]++;
            }
            else if(value == ('py'))
            {
                languageMap[2]++;
            }
            else if(value == ('cpp'))
            {
                languageMap[3]++;
            }
            else if(value == ('js'))
            {
                languageMap[4]++;
            }
            else
            {
                languageMap[5]++;
            }
        }
        // Use pie() to place in bins
        vis.data_bins = vis.pie(languageMap);

        vis.colors = vis.color.domain(vis.data_bins);

        // Now render
        vis.render();
    }

    /** @function wrangle()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render()
    {
        // Define this vis
        const vis = this;

        vis.g.selectAll('.donutG')
            .data(vis.data_bins)
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'donutG')
                    .each(function(d,i){
                        const g = d3.select(this);

                        g.append('path')
                            .attr('d', vis.arc)
                            .attr('fill', vis.colors(i))
                    })
                    .on('mouseover', function(d,i) {
                        const language = vis.keys[d.index];
                        d3.select(this)
                            .transition()
                            .duration(750)
                            .attr('opacity', '0.5')
                        vis.g.select('text')
                            .text(language + ' ' + d.data/100 + "%");
                    })
                    .on('mouseout', function(d,i) {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr('opacity', '1')
                        vis.g.select('text')
                            .text('Hover Over');
                    })
            )
    }
}