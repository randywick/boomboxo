import React from 'react';

export default class Visualizer extends React.Component {

    constructor (props) {
        super(props);

        this.canvas = React.createRef();
        this.canvasCtx = null;

        this.width = 500;
        this.height = 200;

    }

    componentDidMount () {
        this.canvasCtx = this.canvas.current.getContext('2d');
    }

    componentDidUpdate () {
        this.draw();
    }

    draw () {
        const ctx = this.canvasCtx;
        ctx.fillStyle = 'rgb(200, 200, 200)';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.beginPath();

        const sliceWidth = this.width * 1.0 / this.props.bufferLength;
        let x = 0;

        for (let i = 0; i < this.props.bufferLength; i++) {

            const sample = this.props.sampleDataArray[i];

            const v = sample / 128;
            // const v = sample

            // const y = v * this.height / 2;
            // const y = (v * this.height / 4) + this.height;
            const divisor = this.props.domain === 'time' ? 2 : 3;
            const center = this.props.domain === 'frequency' ? this.height * 0.5 : 0;
            const y = v * this.height / divisor + center;


            if (!i) {
                ctx.moveTo(x, y);
            } else if (v) {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        // ctx.lineTo(this.width, this.height / 2);
        //ctx.lineTo(this.width, this.height);
        ctx.stroke();
    }

    drawTimeDomain () {
        const ctx = this.canvasCtx;
        ctx.fillStyle = 'rgb(200, 200, 200)';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.beginPath();

        const sliceWidth = this.width * 1.0 / this.props.bufferLength;
        let x = 0;

        for (let i = 0; i < this.props.bufferLength; i++) {

            const sample = this.props.sampleDataArray[i];

            const v = sample / 128;
            // const v = sample

            // const y = v * this.height / 2;
            // const y = (v * this.height / 4) + this.height;
            const y = v * this.height / 3 + this.height * 0.5;


            if (!i) {
                ctx.moveTo(x, y);
            } else if (v) {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        // ctx.lineTo(this.width, this.height / 2);
        //ctx.lineTo(this.width, this.height);
        ctx.stroke();
    }
    render () {
        return (
            <canvas
                ref={this.canvas}
                height={this.height}
                width={this.width}
                style={{ display: 'block' }}
            ></canvas>
        );
    }



}
