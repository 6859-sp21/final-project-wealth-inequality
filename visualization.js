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

        console.log('Hello')
        console.log(start_box)
        console.log(end_box)

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

    var fairnessSlider = d3.sliderBottom().min(0.0).max(0.3).ticks(5).default(fairness).displayValue(false).width(200)
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

        console.log(fairness)
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


function draw_economy_simulator() {
    const container = d3.select('#economy-simulator')
    const margin = {left: 30, right: 10, top: 10, bottom: 50}
    const width = container.node().getBoundingClientRect()['width'] - margin.left - margin.right
    const height = 0.75 * width

    const svg = container.append('svg')
        .style("width", width + margin.left + margin.right)
        .style("height", height + margin.top + margin.bottom)

    // draw axes (initial)
    var x = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right])
    var y = d3.scaleLinear().domain([0, 8]).range([height - margin.bottom, margin.top])
    svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).attr('class', 'x-axis')
    svg.append('g').attr('transform', `translate(${margin.left},0)`).attr('class', 'y-axis')


    const iter_label = svg.append('text').attr('x', width - 300).attr('y', 15).attr('class', 'iter')

    function plot_histogram(data, duration = 1000) {
        bins = d3.bin().thresholds(25)(data)

        // Change Scale
        x.domain([bins[0].x0, bins[bins.length - 1].x1])
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


        svg
            .selectAll('rect')
            .data(bins)
            .join('rect')
            .transition()
            .duration(duration)
            .attr("x", d => x(d.x0) + 1)
            .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("y", d => y(d.length))
            .attr("height", d => y(0) - y(d.length))
            .attr('fill', 'blue');

    }

    async function simulate_economy(num_iter) {
        const fairness = 0.05
        const fracTransacted = 0.3

        let i;

        for (i = 1; i < num_iter + 1; i++) {

            const indices = getRandom(data, 2) // Select two random participants
            const wealthA = data[indices[0]]
            const wealthB = data[indices[1]]
            const a_pays = Math.random() < 0.5
            let payment_amount = Math.min(wealthA, wealthB) * fracTransacted;
            if ((wealthA < wealthB) === a_pays)
                payment_amount *= (1 - fairness)
            data[indices[0]] += (a_pays ? -1 : 1) * payment_amount
            data[indices[1]] -= (a_pays ? -1 : 1) * payment_amount


            if (i % 100 === 0) {
                plot_histogram(data, 500)
                iter_label.transition().duration(500).text(`Iteration #${i}`).attr('font', 'Helvetica')
                await sleep(500)
            }
            console.log('hello')
        }
    }

    data = Array(1000).fill(300);
    plot_histogram(data, 0)
    simulate_economy(10000)
}

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


draw_economy_simulator();


function draw_wealth_tax_economy_simulator() {
    const container = d3.select('#wealth-tax-economy-simulator')
    const margin = {left: 30, right: 10, top: 10, bottom: 50}
    const width = container.node().getBoundingClientRect()['width'] - margin.left - margin.right
    const height = 0.75 * width

    const svg = container.append('svg')
        .style("width", width + margin.left + margin.right)
        .style("height", height + margin.top + margin.bottom)

    // draw axes (initial)
    var x = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right])
    var y = d3.scaleLinear().domain([0, 8]).range([height - margin.bottom, margin.top])
    svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).attr('class', 'x-axis')
    svg.append('g').attr('transform', `translate(${margin.left},0)`).attr('class', 'y-axis')


    const iter_label = svg.append('text').attr('x', width - 300).attr('y', 15).attr('class', 'iter')

    function plot_histogram(tax_data, duration = 1000) {
        bins = d3.bin().thresholds(25)(tax_data)

        // Change Scale
        x.domain([bins[0].x0, bins[bins.length - 1].x1])
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


        svg
            .selectAll('rect')
            .data(bins)
            .join('rect')
            .transition()
            .duration(duration)
            .attr("x", d => x(d.x0) + 1)
            .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("y", d => y(d.length))
            .attr("height", d => y(0) - y(d.length))
            .attr('fill', 'blue');

    }

    async function simulate_tax_economy(num_iter) {
        const fairness = 0.05
        const fracTransacted = 0.3
        const wealthTax = 0.25
        let i;

        for (i = 1; i < num_iter + 1; i++) {
            tax_data = tax_data.filter((d) => d > 0)
            const indices = getRandom(tax_data, 2) // Select two random participants
            const wealthA = tax_data[indices[0]]
            const wealthB = tax_data[indices[1]]
            const a_pays = Math.random() < 0.5
            let payment_amount = Math.min(wealthA, wealthB) * fracTransacted;
            if ((wealthA < wealthB) === a_pays)
                payment_amount *= (1 - fairness)

            if (a_pays)
                payment_amount += wealthTax * (wealthA - d3.mean(tax_data))
            else
                payment_amount += wealthTax * (wealthB - d3.mean(tax_data))

            tax_data[indices[0]] += (a_pays ? -1 : 1) * payment_amount
            tax_data[indices[1]] -= (a_pays ? -1 : 1) * payment_amount


            if (i % 100 === 0) {
                plot_histogram(tax_data, 500)
                iter_label.transition().duration(500).text(`New Iteration #${i}`).attr('font', 'Helvetica')
                await sleep(500)
            }
        }
    }

    tax_data = Array(1000).fill(300);
    plot_histogram(tax_data, 0)
    simulate_tax_economy(10000)
}

draw_wealth_tax_economy_simulator()

document.addEventListener('mousedown', function (event) {
    if (event.detail > 1) {
        event.preventDefault();
        // of course, you still do not know what you prevent here...
        // You could also check event.ctrlKey/event.shiftKey/event.altKey
        // to not prevent something useful.
    }
}, false);
