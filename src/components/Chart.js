import React from 'react'
import { XYPlot, XAxis, YAxis, LineSeries, VerticalGridLines, HorizontalGridLines } from 'react-vis'

import 'react-vis/dist/style.css'
import './Chart.css'

const Chart = () => {
    const data = [
        { x: 0, y: 5 },
        { x: 100, y: 7 },
        { x: 200, y: 4 },
        { x: 300, y: 9 },
        { x: 400, y: 3 },
        { x: 500, y: 10 },
        { x: 600, y: 2 },
        { x: 700, y: 4 },
        { x: 800, y: 8 },
        { x: 900, y: 29 },
        { x: 1000, y: 4.7 }
    ]

    return (
        <div className="Chart">
            <XYPlot height={300} width={500} xType="ordinal">
                <VerticalGridLines />
                <HorizontalGridLines />
                <YAxis className='Title-color' title='Price in OCN' />
                <XAxis className='Title-color' title='Q Local Tokens' />
                <LineSeries
                    data={data}
                    style={{ stroke: '#7b1173', strokeWidth: 3 /* stylelint-disable-line */ }} />
            </XYPlot>

        </div>
    )
}

const Chart2 = () => {
    const data = [
        { x: 0, y: 0 },
        { x: 100, y: 1 },
        { x: 200, y: 2 },
        { x: 300, y: 3 },
        { x: 400, y: 4 },
        { x: 500, y: 5 },
        { x: 600, y: 6 },
        { x: 700, y: 7 },
        { x: 800, y: 8 },
        { x: 900, y: 9 },
        { x: 1000, y: 10 }
    ]

    return (
        <div className="Chart">
            <XYPlot height={300} width={500}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <YAxis className='Title-color' title='Price in OCN' />
                <XAxis className='Title-color' title='Q Local Tokens' />
                <LineSeries
                    data={data}
                    style={{ stroke: '#7b1173', strokeWidth: 3 /* stylelint-disable-line */ }} />
            </XYPlot>
        </div>
    )
}

export {
    Chart,
    Chart2,
}
