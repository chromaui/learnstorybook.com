import Prism from 'prismjs';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import loadLanguages from 'prismjs/components/index';

import 'prismjs/themes/prism.css';

loadLanguages(['bash', 'typescript', 'json']);

class Highlight extends React.Component {
  componentDidMount() {
    this.highlightCode();
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  highlightCode() {
    const domNode = ReactDOM.findDOMNode(this); // eslint-disable-line
    Prism.highlightAllUnder(domNode);
  }

  render() {
    const { children } = this.props;
    // eslint-disable-next-line react/no-danger
    return <div dangerouslySetInnerHTML={{ __html: children }} />;
  }
}

Highlight.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Highlight;
