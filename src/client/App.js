import React from 'react';
import Panel from './Panel';
import Visualizer from './Visualizer';
// import * as d3 from 'd3-array';

export default class App extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            // audioSrc: '/audio/1727795196.mp3',
            audioSrc: '/audio/1687687064.mp3',
            sampleDataArray: null,
        };

        this.audioElement = React.createRef();
        this.bufferLength = null;

        this.frequencyDomainArrayStatistics = null;
        this.frequencyDomainHistoryLength = 1000;

    }

    componentDidMount () {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        // this.audioContext = new AudioContext();
        const audioContext = new AudioContext();
        this.audioElement.current.play();
        const mediaSource = audioContext.createMediaElementSource(this.audioElement.current);
        this.analyser = audioContext.createAnalyser();

        mediaSource.connect(this.analyser);
        this.analyser.connect(audioContext.destination);
        this.bufferLength = this.analyser.frequencyBinCount;

        this.setState({ bufferLength: this.bufferLength });

        this.analyser.fftSize = 2048;

        this.updateSampleDataArray();

    }

    evaluateSampleFrequencyDataArray (data) {
        if (!this.frequencyDomainArrayStatistics) {
            this.frequencyDomainArrayStatistics = Array(this.bufferLength)
                .fill(0, 0, this.bufferLength)
                .map(() => []);
        }

        const statistics = this.frequencyDomainArrayStatistics;

        data.forEach((value, index) => {
            const itemStats = statistics[index];
            const length = itemStats.length;
            const maxLength = this.frequencyDomainHistoryLength;

            if (length > maxLength) {
                itemStats.splice(0, length - maxLength + 1);
            }

            itemStats.push(value);

        })
    }

    updateSampleFrequencyDataArray () {

        // Initialize a new array of unsigned 8-bit integers for the state.
        const sampleFrequencyDataArray = new Uint8Array(this.bufferLength);

        // Copy the current sample data to the data array.
        this.analyser.getByteFrequencyData(sampleFrequencyDataArray);

        this.evaluateSampleFrequencyDataArray(sampleFrequencyDataArray);

        return sampleFrequencyDataArray;

    }

    updateSampleTimeDataArray () {

        // Initialize a new array of unsigned 8-bit integers for the state.
        const sampleTimeDataArray = new Uint8Array(this.bufferLength);

        // Copy the current sample data to the data array.
        this.analyser.getByteTimeDomainData(sampleTimeDataArray);

        return sampleTimeDataArray;

    }

    /**
     * Updates the `sampleDataArray` state property with current samples.
     * Recursively called via `requestAnimationFrame` to facilitate dependent
     * child animation.
     */
    updateSampleDataArray () {

        // Update the state with the new array.
        this.setState({
            sampleFrequencyDataArray: this.updateSampleFrequencyDataArray(),
            sampleTimeDataArray: this.updateSampleTimeDataArray(),
        });

        // Recurse when available.
        requestAnimationFrame(() => this.updateSampleDataArray());

    }

    render() {
        return (
            <div>
                <audio ref={this.audioElement} src={this.state.audioSrc}></audio>
                <Visualizer bufferLength={this.state.bufferLength} sampleDataArray={this.state.sampleFrequencyDataArray} domain="frequency" />
                <Visualizer bufferLength={this.state.bufferLength} sampleDataArray={this.state.sampleTimeDataArray} domain="time" />
                <Panel value={this.state.bpm} />
            </div>
        )
    }

}
