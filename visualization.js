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
            .attr('x', end_box.x - abs_size/2)
            .attr('y', end_box.y - abs_size/2)

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


    var fairness = 0.5;

    var fairnessSlider = d3.sliderBottom().min(0.05).max(0.95).ticks(5).default(0.5).displayValue(false).width(200)
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
    var transactSlider = d3.sliderBottom().min(0.05).max(0.95).ticks(5).default(0.5).displayValue(false).width(200)
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

    button.on('mouseover', () => {button.attr('fill', 'black')})
    button.on('mouseout', () => {button.attr('fill', 'grey')})

    svg.append('text').attr('x', 495).attr('y', 75).text('Click to Run Transaction').attr('fill', 'white').style('pointer-events', 'none')
}


draw_transaction_simulator();

// transaction(100, 100, 0.1, 0.5)