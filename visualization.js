function draw_transaction_simulator() {
    const container = d3.select('#transaction-simulator')
    const width = container.node().getBoundingClientRect()['width']
    const svg_height = 0.75 * width
    const margins = {'left': 10, 'right': 10, 'top': 10, 'bottom': 10}

    const svg = container.append('svg')
        .style("width", width)
        .style("height", svg_height);

    let individuals = [{'name': 'A', 'size': 150, 'x': 200, 'y': 350},
        {'name': 'B', 'size': 150, 'x': 600, 'y': 350}]


    function draw_squares(duration = 0, delay = 0) {
        svg.selectAll('rect#individual').data(individuals).join('rect')  // Creates the rectangle for each object
            .attr('id', 'individual')
            .transition().delay(delay).duration(duration)
            .attr('width', (d) => d.size)
            .attr('height', (d) => d.size)
            .attr('x', (d) => d.x - d.size / 2)
            .attr('y', (d) => d.y - d.size / 2)
            .attr('fill', 'black')
    }

    function draw_transfer(size) {
        const start_box = individuals[(size < 0) ? 1 : 0]
        const end_box = individuals[(size < 0) ? 0 : 1]


        const abs_size = Math.abs(size)
        let transfer = svg.append('rect').attr('width', abs_size).attr('height', abs_size)
            .attr('x', start_box.x - abs_size / 2).attr('y', start_box.y - abs_size / 2)
            .attr('fill', 'black')

        transfer.transition().duration(2000)
            .attr('x', end_box.x - abs_size / 2)
            .attr('y', end_box.y - abs_size / 2)

        individuals[(size < 0) ? 1 : 0].size -= abs_size
        individuals[(size < 0) ? 0 : 1].size += abs_size

        draw_squares(500, 1100)
        transfer.transition().delay(2000).remove()

        update_sliders(1000)
    }


    draw_squares(0);


    var sliderAHousing = svg.append('g').attr('id', 'sliderAHousing')
        .attr('transform', `translate(${individuals[0].x - 150},${individuals[0].y + individuals[0].size / 2 + 50})`);


    var sliderA = d3.sliderBottom().min(1).max(300).ticks(5).default(150.0).width(300)
        .on('onchange', (val) => {
            individuals[0].size = val
            update_sliders(1000)
            draw_squares(1000)
        });

    sliderAHousing.call(sliderA)

    var sliderBHousing = svg.append('g').attr('id', 'sliderBHousing')
        .attr('transform', `translate(${individuals[1].x - 150},${individuals[1].y + individuals[1].size / 2 + 50})`);

    var sliderB = d3.sliderBottom().min(1).max(300).ticks(5).default(150.0).width(300)
        .on('onchange', (val) => {
            individuals[1].size = val
            update_sliders(1000)
            draw_squares(1000)
        });

    sliderBHousing.call(sliderB)


    function update_sliders(duration) {
        sliderA.value(individuals[0].size)
        sliderB.value(individuals[1].size)
        sliderAHousing.transition().duration(duration).attr('transform', `translate(${individuals[0].x - 150},${individuals[0].y + individuals[0].size / 2 + 50})`);
        sliderBHousing.transition().duration(duration).attr('transform', `translate(${individuals[1].x - 150},${individuals[1].y + individuals[1].size / 2 + 50})`);
    }


    var fairness = 0.95;

    var fairnessSlider = d3.sliderBottom().min(0.0).max(0.1).ticks(5).default(fairness).displayValue(false).width(200)
        .on('onchange', (val) => {
            fairness = val
        })
    svg.append('g').attr('id', 'fairnessSliderHousing')
        .attr('transform', 'translate(175, 35)')
        .call(fairnessSlider)
    svg.append('text')
        .attr('x', 65)
        .attr('y', 40)
        .text('Fairness')

    var fracTransacted = 0.3;
    var transactSlider = d3.sliderBottom().min(0.05).max(0.5).ticks(5).default(0.5).displayValue(false).width(200)
        .on('onchange', (val) => {
            fracTransacted = val
        })
    svg.append('g').attr('id', 'fairnessSliderHousing')
        .attr('transform', 'translate(175, 100)')
        .call(transactSlider)
    svg.append('text')
        .attr('x', 0)
        .attr('y', 105)
        .text('Frac Transacted')


    function transaction(event) {
        const wealthA = individuals[0].size
        const wealthB = individuals[1].size


        const a_pays = Math.random() < 0.5


        let payment_amount = Math.min(wealthA, wealthB) * fracTransacted;

        if ((wealthA < wealthB) === a_pays)
            payment_amount *= (1 - fairness)


        draw_transfer(Math.round(payment_amount * (a_pays ? 1 : -1)))
    }


    let button = svg.append('rect').attr('height', 75).attr('width', 300).attr('fill', 'grey')
        .attr('x', 450).attr('y', 30).on('click', transaction)

    button.on('mouseover', () => {
        button.attr('fill', 'black')
    })
    button.on('mouseout', () => {
        button.attr('fill', 'grey')
    })

    svg.append('text').attr('x', 495).attr('y', 75).text('Click to Run Transaction').attr('fill', 'white').style('pointer-events', 'none')
}

draw_transaction_simulator();


function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = x in taken ? taken[x] : x;
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function draw_wealth_tax_economy_simulator(container_name, wealthTaxEnabled) {
    var fairness = 0.05
    var fracTransacted = 0.2
    var speed_delay = 100;
    var wealthTax = wealthTaxEnabled ? 0.1 : 0.0

    const ax_label_size = 20;

    const container = d3.select(container_name)
    const margin = {left: 30, right: 0, top: 10, bottom: 75}
    const width = container.node().getBoundingClientRect()['width'] - margin.left - margin.right
    const height = 0.75 * width
    let abort = true;
    const svg = container.append('svg')
        .style("width", width + margin.left + margin.right)
        .style("height", height + margin.top + margin.bottom)

    // draw axes (initial)
    var x = d3.scaleLinear().domain([0, 100]).range([margin.left + ax_label_size, width - margin.right])
    var y = d3.scaleLinear().domain([0, 8]).range([height - margin.bottom - ax_label_size, margin.top])
    svg.append('g').attr('transform', `translate(0,${height - margin.bottom - ax_label_size})`).attr('class', 'x-axis')
    svg.append('g').attr('transform', `translate(${margin.left + ax_label_size},0)`).attr('class', 'y-axis')

    svg.append('text')
        .text('Wealth of Individual ($)')
        .attr('x', (margin.left + ax_label_size + width - margin.right) / 2)
        .attr('y', height - margin.bottom + ax_label_size)
        .attr('font-family', 'Helvetica').attr('font-size', 20).style('pointer-events', 'none')
        .style("text-anchor", "middle")


    svg.append('text')
        .attr("text-anchor", "middle")
        .attr("y", 3)
        .attr('x', -(height - margin.bottom - ax_label_size + margin.top) / 2)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .attr('font-family', 'Helvetica').attr('font-size', 20).style('pointer-events', 'none')
        .text('# of Individuals (Count)')

    svg.append('image')
        .attr('href', 'https://i.ibb.co/zHQv7vS/cividis.png')
        .attr('x', width - margin.left - margin.right - 290)
        .attr('y', 50)
        .attr('width', 150)

    svg.append('text')
        .text('Total Wealth in Bar ($)')
        .attr('x', width - margin.left - margin.right - 290 + 75)
        .attr('y', 100)
        .attr('font-family', 'Helvetica').attr('font-size', 20).style('pointer-events', 'none')
        .style("text-anchor", "middle")


    let iteration = 0;
    const iter_label = svg.append('text').attr('x', width - 300).attr('y', 15).attr('class', 'iter')

    function plot_histogram(tax_data, duration = 1000) {
        duration = speed_delay;
        bins = d3.bin().thresholds([0, 13, 26, 40, 53, 66, 80, 93, 106, 120, 133, 146, 160, 173, 186, 200, 213, 226, 240, 253, 266, 280, 293, 306, 320, 333, 346, 360, 373, 386, 400])(tax_data)

        // Change Scale
        // x.domain([bins[0].x0, bins[bins.length - 1].x1])
        x.domain([0, 400])

        y.domain([0, d3.max(bins, d => d.length)])


        // Update Axes
        svg.select(".x-axis")
            .transition()
            .duration(duration)
            .call(d3.axisBottom(x).ticks(width / 80))
        svg.select(".y-axis")
            .transition()
            .duration(duration)
            .call(d3.axisLeft(y).ticks(height / 40))

        // console.log(d3.schemeGnBu)
        var colors = d3.scaleSequential(d3.interpolateCividis).domain([0, d3.max(bins, d => d.length * (d.x0 + d.x1))])

        svg
            .selectAll('rect.bar')
            .data(bins)
            .join(
                (enter) =>
                    enter.append("rect").attr('class', 'bar')
                        .attr("x", d => x(d.x0))
                        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0)))
                        .attr('y', y(0))
                        .attr('height', 0)
                        .call(enter => enter.transition(duration)
                            .attr("height", d => y(0) - y(d.length))
                            .attr("y", d => y(d.length)))
                        .attr('fill', d => colors(d.length * (d.x0 + d.x1)))
                ,
                (update) => update.attr("x", d => x(d.x0))
                    .attr('class', 'bar')
                    .attr("width", d => Math.max(0, x(d.x1) - x(d.x0)))
                    .call(update => update.transition(duration)
                        .attr('fill', d => colors(d.length * (d.x0 + d.x1)))
                        .attr("height", d => y(0) - y(d.length))
                        .attr("y", d => y(d.length)))
                ,
                (exit) => exit.call(exit => exit.transition(duration).attr("height", d => 0)
                    .attr("y", d => y(0)))
            );
    }

    async function simulate_tax_economy(num_iter, speed = 0) {
        abort = false;

        for (; iteration < num_iter + 1; iteration++) {
            if (abort) return;
            const indices = getRandom(tax_data, 2) // Select two random participants
            const wealthA = tax_data[indices[0]]
            const wealthB = tax_data[indices[1]]

            let payment_amount;
            if (wealthA <= wealthB)
                payment_amount = wealthA * fracTransacted * (1 - fairness)
            else
                payment_amount = wealthB * fracTransacted

            payment_amount += wealthTax * (wealthA - d3.mean(tax_data))

            tax_data[indices[0]] -= payment_amount
            tax_data[indices[1]] += payment_amount


            if (iteration % 1000 === 0) {
                plot_histogram(tax_data, speed)
                iter_label.transition().duration(speed).text(`Iteration #${iteration}`).attr('font', 'Helvetica')
                await sleep(speed)
            }
        }
    }

    var tax_data;

    function reset_tax_data() {
        tax_data = [];
        let i;
        for (i = 0; i < 1000; i++) {
            tax_data.push(d3.randomNormal(100, 25)())
        }
    }

    iteration = 0;
    reset_tax_data();
    simulate_tax_economy(1, 0);


    add_button(0, height - margin.bottom + 25, 80, 40, svg, 'Play').on('click', () => {
        const text_element = svg.select('#Play-label')
        const width_diff = BrowserText.getWidth('Pause', 20, 'Helvetica') - BrowserText.getWidth('Play', 20, 'Helvetica')
        if (text_element.text() === 'Play') {
            simulate_tax_economy(1e12, speed_delay);
            text_element.text('Pause').attr('x', 20.546875 - width_diff / 2)
        } else {
            abort = true;
            text_element.text('Play').attr('x', 20.546875)
        }
    })


    add_button(100, height - margin.bottom + 25, 80, 40, svg, 'Reset').on('click', () => {
        iteration = 0;
        reset_tax_data();
        simulate_tax_economy(1, 0);
    })

    if (wealthTaxEnabled) {
        add_slider(450, height - margin.bottom + 85, 200, 40, svg, 'Wealth Tax:', 0, 0.2).on('onchange', (val) => {
            wealthTax = val
        })
    }

    add_slider(450, height - margin.bottom + 25, 250, 40, svg, 'Frac Transacted:', 0, 0.4).on('onchange', (val) => {
        fracTransacted = val
    })

    add_slider(200, height - margin.bottom + 25, 200, 40, svg, 'Fairness:', 0, 0.1).on('onchange', (val) => {
        fairness = val
    })

    add_slider(200, height - margin.bottom + 85, 200, 40, svg, 'Speed:', 0, 100, 75).on('onchange', (val) => {
        speed_delay = 400 - 4 * val;
    })
}

let BrowserText = (function () {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    /**
     * Measures the rendered width of arbitrary text given the font size and font face
     * @param {string} text The text to measure
     * @param {number} fontSize The font size in pixels
     * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
     * @returns {number} The width of the text
     **/
    function getWidth(text, fontSize, fontFace) {
        context.font = fontSize + 'px ' + fontFace;
        return context.measureText(text).width;
    }

    return {
        getWidth: getWidth
    };
})();

draw_wealth_tax_economy_simulator('#economy-simulator', false)
draw_wealth_tax_economy_simulator('#wealth-tax-economy-simulator', true)


function add_slider(loc_x, loc_y, loc_width, loc_height, svg_to_add, text, min, max, default_val = 0.25) {
    const text_width = BrowserText.getWidth(text, 20, 'Helvetica')
    svg_to_add.append('text').attr('y', loc_y + loc_height / 2 + 5)
        .attr('x', loc_x).attr('fill', 'black')
        .text(text).attr('font-family', 'Helvetica').attr('font-size', 20).style('pointer-events', 'none')

    const myslider = d3.sliderBottom().min(min).max(max).ticks(2).default(default_val).displayValue(false).width(loc_width - text_width)
    svg_to_add.append('g').attr('id', `${text}sliderhousing`)
        .attr('transform', `translate(${loc_x + text_width + 20}, ${loc_y + 20})`)
        .call(myslider)
    return myslider
}

function add_button(loc_x, loc_y, loc_width, loc_height, svg_to_add, text) {
    const my_button = svg_to_add.append('rect').attr('x', loc_x).attr('y', loc_y).attr('width', loc_width).attr('height', loc_height).attr('fill', 'grey')

    my_button.on('mouseover', () => {
        my_button.attr('fill', 'black')
    })
    my_button.on('mouseout', () => {
        my_button.attr('fill', 'grey')
    })

    const text_width = BrowserText.getWidth(text, 20, 'Helvetica')
    svg_to_add.append('text').attr('y', loc_y + loc_height / 2 + 5)
        .attr('x', loc_x + loc_width / 2 - text_width / 2).attr('fill', 'white')
        .attr('id', `${text}-label`)
        .text(text).attr('font-family', 'Helvetica').attr('font-size', 20).style('pointer-events', 'none')

    return my_button
}