import React, { Component } from 'react';
import ConnectionHandler from '../ConnectionHandler/ConnectionHandler'
import { Textbox, Button } from "../Components/UIElements";
import Row from '../Components/Row'
import './Timer.css'

class Timer extends Component {
    constructor(props) {
        super(props)
        this.secondsRemaining = 60;
        this.state = {
            paragraph: '',
            inputText: '',
            wrongWord: false,
            secondsRemaining: this.secondsRemaining,
            timerStarted: false,
            timerFinished: false,
            enteredText: '',
        }
        this.triggerLoremIpsum = this.triggerLoremIpsum.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.ticking = this.ticking.bind(this);
        this.reset = this.reset.bind(this);
        this.wrongCount = 0;
    }

    triggerLoremIpsum() {
        ConnectionHandler.sendRequest().then(response => {
            let paragraph = response.body.text_out.replace(/<p>/g, '').replace(/<\/p>/g, '');
            this.setState({ paragraph })
        })
    }

    componentDidMount() {
        this.triggerLoremIpsum();
    }

    onTextChange(e) {
        let inputText = e.target.value;

        if (this.state.timerFinished)
            return;

        if (!this.interval) {
            this.setState({ secondsRemaining: this.secondsRemaining })
            this.interval = setInterval(this.ticking, 1000);
        }

        if (this.state.paragraph.indexOf(inputText) === 0) {
            this.setState({ inputText, wrongWord: false, timerStarted: true });
        } else {
            this.wrongCount++;
            this.setState({ wrongWord: true, timerStarted: true });
        }

    }

    // Will be called for each second
    ticking() {
        this.setState({ secondsRemaining: this.state.secondsRemaining - 1 });
        if (this.state.secondsRemaining <= 0) {
            clearInterval(this.interval);
            this.interval = null;
            let enteredText = this.state.inputText;
            this.setState({ timerFinished: true, timerStarted: false, inputText: '', wrongWord: false, enteredText })
        }
    }

    reset() {
        this.setState({ timerFinished: false, paragraph: '' })
        this.triggerLoremIpsum();
    }

    render() {

        // Paragraph Message
        var completedText, remainingText;
        if (this.state.paragraph.indexOf(this.state.inputText) === 0) {
            completedText = <span className='completed-text'>{this.state.inputText}</span>
            let remains = this.state.paragraph.replace(this.state.inputText, '');
            remainingText = <span className='remaining-text'>{remains}</span>
        }

        // Messages 
        let remainingTimeMsg = 'Remaining time (In Seconds) - ' + this.state.secondsRemaining;
        let finishedMsg = 'Time Over..!';
        let idleMsg = 'Timer will be fired when you start typing..!';
        let message = this.state.timerStarted ? remainingTimeMsg : this.state.timerFinished ? finishedMsg : idleMsg;

        // Result Calculations & UI
        var resultUI;
        if (this.state.timerFinished) {
            let wordCount = this.state.enteredText.split(' ').length;
            let charCount = this.state.enteredText.trim().length;

            let result = { 'Words Per Minute': wordCount, 'Characters Per Second': (charCount / 60).toFixed(2), 'Wrong Input': this.wrongCount + ' times', 'Accuracy': (100 - ((this.wrongCount / charCount) * 100)).toFixed(2) + '%' }

            resultUI = Object.keys(result).map((item, i) => <Row Key={'row-' + i} keyName={item} value={result[item]} />)
        }
        return (
            <div className="timer">
                <header className='timer-header'> Smash your keyboard </header>

                <div className='typing-area'>
                    <div className='title'> Measure your quickness in keyboard typing. You have 60 Seconds in total.</div>
                    <div className='message'> {message} </div>
                    <div className='paragraph'>{completedText}{remainingText}</div>
                    <Textbox wrongWord={this.state.wrongWord} onChange={this.onTextChange} value={this.state.inputText} />
                    {this.state.wrongWord && <p className='error-msg'> Wrong..!! </p>}
                </div>

                <div className='result-area'>
                    {this.state.timerFinished && <div className='result-table'> <p className='result'>Results</p> {resultUI}</div>}
                    {this.state.timerFinished && <Button onClick={this.reset} title='Reset' rounded={true} />}
                </div>

            </div>
        );
    }
}

export default Timer;
