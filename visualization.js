function draw_transaction_simulator() {
    const container = d3.select('#transaction-simulator')
    const width = container.node().getBoundingClientRect()['width']
    const svg_height = 0.75 * width
    const margins = {'left': 10, 'right': 10, 'top': 10, 'bottom': 10}

    const svg = container.append('svg')
        .style("width", width)
        .style("height", svg_height);

    let individuals = [{'name': 'A', 'size': 150, 'x': 200, 'y': 300},
        {'name': 'B', 'size': 150, 'x': 600, 'y': 300}]

    function update_sliders(duration) {
        container.selectAll('input').data(individuals).join('input').transition().duration(duration)
            .attr('value', (d) => d.size)
    }

    function draw_squares(duration = 0, delay = 0) {
        let rect = svg.selectAll('rect').data(individuals).join('rect')  // Creates the rectangle for each object
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
        let transfer = svg.append('circle').attr('r', abs_size / 2)
            .attr('cx', start_box.x).attr('cy', start_box.y)
            .attr('fill', 'black')

        transfer.transition().duration(2000)
            .attr('cx', end_box.x)
            .attr('cy', end_box.y)

        individuals[(size < 0) ? 1 : 0].size -= abs_size
        individuals[(size < 0) ? 0 : 1].size += abs_size

        draw_squares(500, 1100)
        transfer.transition().delay(2000).remove()

        update_sliders(1000)
    }

    function transaction(event, fairness =0.1, fracTransacted = 0.3) {
        const wealthA = individuals[0].size
        const wealthB = individuals[1].size


        const a_pays = Math.random() < 0.5


        let payment_amount = Math.min(wealthA, wealthB) * fracTransacted;

        if ((wealthA < wealthB) === a_pays)
            payment_amount *= fairness


        draw_transfer(Math.round(payment_amount * (a_pays ? 1 : -1)))
    }


    draw_squares(0);


    // Add the individual sliders


    container.selectAll('input').data(individuals).join('input') // Creates a new input object for each individual
        .attr('type', 'range').attr('min', 0).attr('max', 300).attr('value', (d) => d.size).attr('id', (d) => d.name)
        .on('change', function (d) {
            const selectedValue = parseInt(this.value)
            const name = this.id
            individuals.forEach(function (individual, index) {
                if (individual.name === name) individuals[index].size = selectedValue;
            });

            update_sliders(0);
            draw_squares(1000);
        })

    container.append('button').text('Transact').on('click', transaction)


}


draw_transaction_simulator();

// transaction(100, 100, 0.1, 0.5)