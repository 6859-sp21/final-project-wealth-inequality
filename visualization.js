function transaction(wealthA, wealthB, fairness, fracTransacted) {
    const a_pays = Math.random() < 0.5

    let payment_amount = Math.min(wealthA, wealthB) * fracTransacted

    if ((wealthA < wealthB) === a_pays)
        payment_amount *= fairness

    wealthA -= payment_amount * (a_pays ? 1 : -1)
    wealthB -= payment_amount * (a_pays ? -1 : 1)

    console.log('Wealth A: ' + wealthA)
    console.log('Wealth B: ' + wealthB)
}


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

        const abs_size = Math.abs(size)
        let box = svg.append('circle').attr('r', abs_size / 2)
            .attr('cx', start_box.x).attr('cy', start_box.y)
            .attr('fill', 'black')

        box.transition().duration(2000)
            .attr('cx', end_box.x)
            .attr('cy', end_box.y)

        individuals[(size < 0) ? 1 : 0].size -= abs_size
        individuals[(size < 0) ? 0 : 1].size += abs_size
        draw_squares(500, 1100)

        box.transition().delay(2000).remove()
    }


    // <input type="range" name="mySlider" id=mySlider min="10" max="100" value="50">
    draw_squares(0);
    draw_transfer(50)


    container.selectAll('input').data(individuals).enter().append('input') // Creates a new input object for each individual
        .attr('type', 'range').attr('min', 0).attr('max', 300).attr('value', 150).attr('step', 5).attr('id', (d) => d.name)
        .on('change', function (d) {
            const selectedValue = this.value
            const name = this.id
            individuals.forEach(function (individual, index) {
                if (individual.name === name) individuals[index].size = selectedValue;
            });

            console.log(individuals);
            // console.log(data);
            // console.log(individuals)
            // console.log('Selected Value: ' + selectedValue)
            draw_squares(1000);
        })


}


draw_transaction_simulator();

// transaction(100, 100, 0.1, 0.5)