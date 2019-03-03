'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { readFileSync } from 'fs'
import Tokenizer from 'sentence-tokenizer';
import { log } from 'util';

const BUCKET = 'http://fingermonkey.com/ozet-films/';

const TEXT = readFileSync(__dirname + '/text/oort.txt', 'utf-8');
const T = new Tokenizer();
T.setEntry(TEXT);
const SENTENCES = T.getSentences();

const VIDEOS = [
  'pigs.mp4',
  'ice.mp4',
  'snails.m4v',
  'dirt.mp4',
  'cows.mp4'
]

const BGS = [
  'cloud',
  'nebula',
  'board',
  'rocks'
]

function randomTo(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Words extends Component {
  
  constructor(props) {
    super(props);
    this.state = this.update();
    this.interval = null;
  }

  componentDidMount() {
    console.log('mounted')
    this.interval = setInterval(() => {
      this.setState(this.update());
    }, 5000)
  }

  componentWillUnmount() {
    console.log('unmounted')
    clearInterval(this.interval);
  }

  update() {
    console.log('update text')
    const numberOfSentences = randomTo(1, this.props.maxLength)
    return {
      numberOfSentences,
      sentencesIndex: randomTo(0, SENTENCES.length - numberOfSentences)
    };
  }

  render() {
    const { sentencesIndex, numberOfSentences } = this.state;
    const text = SENTENCES.slice(sentencesIndex, sentencesIndex + numberOfSentences).join(' ');
    return <div className="the-words">
      <p>{ text }</p>
    </div>
  }
}

Words.propTypes = {
  maxLength: PropTypes.number.isRequired
}

Words.defaultProps = {
  maxLength: 3
}

class Video extends Component {

  constructor(props) {
    super(props);
    this.vid = React.createRef();
  }

  render() {
    const { panel, src } = this.props;
    const fullSrc = `${BUCKET}${src}`;
    return <div className="video-wrapper" data-panel={ panel }>
      <div className="video-wrapper-inner">
        <video src={ fullSrc } autoPlay={ true } loop={ true } ref={ this.vid } muted={ true }/>
      </div>
    </div>
  }
}

class Screen extends Component {
  
  constructor(props) {
    super(props);
    this.state = this.update();
  }

  componentDidMount() {
    setInterval(() => {
      this.setState(this.update());
    }, 10000)
  }

  update() {
    return {
      panels: randomTo(1, 3),
      bg: BGS[randomTo(0, BGS.length - 1)]
    }
  }

  renderPanels() {
    const panels = [];
    const videos = [ ...VIDEOS ];
    for (let i = 0; i < this.state.panels; i++) {
      const src = videos.splice(randomTo(0, videos.length - 1), 1)[0];
      const props = {
        key: `panel-${i}`,
        panel: i + 1,
        src
      }
      panels.push(<Video { ...props } />);
    }
    return panels;
  }

  render() {
    const { panels, bg } = this.state;
    const props = {
      className: 'ozet-screen',
      'data-panels': panels,
      style: {
        'backgroundImage': `url('${BUCKET}${bg}.jpg')`
      }
    }
    return <div { ...props }>
      { this.renderPanels() }
      <Words />
    </div>
  }

}


ReactDOM.render(<Screen />, document.getElementById('screen'));