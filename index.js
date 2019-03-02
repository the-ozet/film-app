'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class Video extends Component {

  constructor(props) {
    super(props);
    this.vid = React.createRef();
  }

  componentDidMount() {
    
  }

  render() {
    const { panel } = this.props;
    return <div className="video-wrapper" data-panel={ panel }>
      <video src="http://fingermonkey.com/ozet-films/snails.m4v" autoPlay={ true } loop={ true } ref={ this.vid } muted={ true }/>
    </div>
  }
}

Video.propTypes = {
  
}

class Screen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      panels: 3
    }
  }

  renderPanels() {
    const panels = []
    for (let i = 0; i < this.state.panels; i++) {
      const props = {
        key: `panel-${i}`,
        panel: i + 1
      }
      panels.push(<Video { ...props } />);
    }
    return panels;
  }

  render() {
    return <div className="ozet-screen" data-panels={ this.state.panels }>
      { this.renderPanels() }
    </div>
  }

}


ReactDOM.render(<Screen />, document.getElementById('screen'));