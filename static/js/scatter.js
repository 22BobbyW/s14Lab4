/**
 * @class Scatter
 */
class Scatter
{
    // Vars
    data_bins = [];

    // Elements
    svg = null;
    g = null;
    xAxisG = null;
    yAxisG = null;

    // Configs
    svgW = 360;
    svgH = 360;
    gMargin = {top: 50, right: 25, bottom: 75, left: 75};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);

    // Tools
    scX = d3.scaleLinear()
            .range([0, this.gW]);
    scY = d3.scaleLinear()
            .range([this.gH, 0]);
    yAxis = d3.axisLeft().ticks(5);
    xAxis = d3.axisBottom().ticks(10);

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
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);
        vis.g.append('text')
            .attr('class', 'label')
            .text('')
            .attr('text-anchor', 'middle')
            .style('transform', `translate(${vis.gW / 2}px, -20px)`)

        // Append axes
        vis.xAxisG = vis.g.append('g')
            .attr('class', 'axis axisX')
            .style('transform', `translateY(${vis.gH + 15}px)`);
        vis.xAxisG.append('text')
            .attr('class', 'label labelX')
            .style('transform', `translate(${vis.gW / 2}px, 40px)`)
            .text('Years of Experience');
        vis.yAxisG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', 'translateX(-15px)');
        vis.yAxisG.append('text')
            .attr('class', 'label labelY')
            .style('transform', `rotate(-90deg) translate(-${vis.gH / 2}px, -30px)`)
            .text('Hours of Homework');


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

        // Map ages
        const experiences = vis.data.map(d => d.experience_yr);
        const hours = vis.data.map(d => d.hw1_hrs);
        const age = vis.data.map(d => d.age);

        for(let i = 0; i < experiences.length; i++)
        {
            vis.data_bins[i] = [experiences[i], hours[i], age[i]];
        }

        // Update scales
        vis.scX.domain([0, d3.max(experiences)]);
        vis.scY.domain([0, d3.max(hours)]);
        vis.xAxis.scale(vis.scX);
        vis.yAxis.scale(vis.scY);

        // Now render
        vis.render();
    }

    /** @function render()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render()
    {
        // Define this vis
        const vis = this;

        // Build bars
        vis.g.selectAll('.circle')
            .data(vis.data_bins)
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'circle')
                    .each(function(d, i) {
                        // Define this
                        const g = d3.select(this);

                        // Get dims
                        const w = vis.gW / vis.data_bins.length;
                        const h = vis.scY(d.length);

                        const x = vis.scX(d[0]);
                        const y = vis.scY(d[1]);
                        const age = d[2];

                        // Append
                        g.append('circle')
                            .attr('cx', x)
                            .attr('cy', y)
                            .attr('r', age/7)
                            .attr('fill', 'rgba(0, 158, 0, 1');

                    })
                    .on('mouseover', function(d,i) {
                        d3.select(this).select("circle").attr("fill", "#82E0AA");
                        const age = d[2];
                        vis.g.select('text')
                            .text(age + " years old");
                    })
                    .on('mouseout', function(d,i) {
                        d3.select(this).select('circle').attr('fill', 'rgba(0, 158, 0, 1)');
                        vis.g.select('text')
                            .text('');
                    })
            );

        // Update axis
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }
}