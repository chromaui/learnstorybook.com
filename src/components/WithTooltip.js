import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Manager, Target, PopperWithArrow } from './Popper';

// A target that doesn't speak popper
// prettier-ignore
const TargetContainer = styled.div`
  display: inline-block;
  cursor: ${props => props.mode === 'hover' ? 'default' : 'pointer'};
`;

const TargetSvgContainer = styled.g`
  cursor: ${props => (props.mode === 'hover' ? 'default' : 'pointer')};
`;

function withinElements(element, elements) {
  return (
    !!elements.find(e => e === element) ||
    (element.parentNode && withinElements(element.parentNode, elements))
  );
}

class WithTooltip extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { hidden: !props.startOpen };
    this.onHideImmediately = this.onHideImmediately.bind(this);
    this.onHide = this.onHide.bind(this);
    this.onHideIfOutsideTooltip = this.onHideIfOutsideTooltip.bind(this);
    this.onHideIfOutsideTooltipOrCloseOnClick = this.onHideIfOutsideTooltipOrCloseOnClick.bind(
      this
    );
    this.onHideIfOutsideBody = this.onHideIfOutsideBody.bind(this);
    this.onShow = this.onShow.bind(this);
    this.onToggleHidden = this.onToggleHidden.bind(this);
  }

  componentDidMount() {
    if (!this.targetElement) {
      // Don't try and render the popper if we haven't actually rendered a DOM
      // element -- i.e we are testing
      return;
    }
    document.body.addEventListener('click', this.onHideIfOutsideTooltipOrCloseOnClick, false);
    // iOS doesn't fire click events unless you actually click on something (it seems).
    document.body.addEventListener('touchend', this.onHideIfOutsideTooltip, false);
    document.addEventListener('click', this.onHideIfOutsideBody, false);
    this.popper = document.createElement('div');
    this.popper.setAttribute('style', 'height:0; width: 0;');
    this.rootEl = document.getElementById('chromatic-root') || document.body;
    this.rootEl.appendChild(this.popper);
    this.renderPopper();
  }

  componentDidUpdate() {
    this.renderPopper();
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.onHideIfOutsideTooltipOrCloseOnClick);
    document.body.removeEventListener('touchend', this.onHideIfOutsideTooltip);
    document.removeEventListener('click', this.onHideIfOutsideBody);
    unmountComponentAtNode(this.popper);
    this.rootEl.removeChild(this.popper);
    this.unmounted = true;
  }

  onHideImmediately() {
    if (!this.unmounted) {
      this.setState({ hidden: true });
    }
  }

  onHide() {
    if (this.props.mode === 'hover') {
      this.timeout = setTimeout(this.onHideImmediately, 300);
    } else {
      setTimeout(this.onHideImmediately, 0);
    }
  }

  onHideIfOutsideTooltip(event) {
    if (
      !this.state.hidden &&
      !withinElements(event.target, [this.targetElement, this.popperElement])
    ) {
      this.onHide();
    }
  }

  onHideIfOutsideTooltipOrCloseOnClick() {
    if (this.state.hidden) {
      return;
    }

    if (this.props.closeOnClick) {
      this.onHide();
    } else {
      this.onHideIfOutsideTooltip();
    }
  }

  onHideIfOutsideBody(event) {
    if (event.target === document.documentElement) {
      this.onHide();
    }
  }

  onShow() {
    clearTimeout(this.timeout);
    this.setState({ hidden: false });
  }

  onToggleHidden(event) {
    // We need to prevent default here because the events fire in different order on different platforms
    // On desktop, the react event fires *second* which means it can clear the "hide" timeouts
    // set by clicking anywhere when closeOnClick is set.
    // On mobile, the react event fires *first* (most of the time), so we can use preventDefault
    // to stop the hide events from firing.
    event.preventDefault();
    if (this.state.hidden) {
      this.onShow();
    } else {
      this.onHide();
    }
  }

  events() {
    const { mode } = this.props;
    if (mode === 'hover') {
      const events = {
        onMouseOver: this.onShow,
        onMouseOut: this.onHide,
      };
      return {
        targetEvents: events,
        popperEvents: events,
      };
    } else if (mode === 'click') {
      return {
        targetEvents: {
          onClick: this.onToggleHidden,
        },
        popperEvents: {},
      };
    }
    throw new Error(`Tooltip mode ${mode} not implemented`);
  }

  renderPopper() {
    const {
      svg,
      mode,
      closeOnClick,
      startOpen,
      placement,
      children,
      hasChrome,
      tooltip,
      ...props
    } = this.props;
    const { hidden } = this.state;

    if (!hidden) {
      const managerElement = (
        <Manager {...props}>
          <Target mode={mode}>
            {({ targetProps: { ref } }) => ref(this.targetElement) || <div />}
          </Target>
          <PopperWithArrow
            innerRef={r => {
              this.popperElement = r;
            }}
            placement={placement}
            hidden={hidden}
            hasChrome={hasChrome}
            {...this.events().popperEvents}
          >
            {typeof tooltip === 'function' ? tooltip({ onHide: this.onHideImmediately }) : tooltip}
          </PopperWithArrow>
        </Manager>
      );

      render(managerElement, this.popper);
    } else {
      unmountComponentAtNode(this.popper);
    }
  }

  render() {
    const { svg, mode, placement, children, hasChrome, tooltip, ...props } = this.props;

    const Container = svg ? TargetSvgContainer : TargetContainer;
    return (
      <Container
        {...this.events().targetEvents}
        innerRef={r => {
          this.targetElement = r;
        }}
        mode={mode}
        {...props}
      >
        {this.props.children}
      </Container>
    );
  }
}
WithTooltip.propTypes = {
  svg: PropTypes.bool,
  mode: PropTypes.string,
  startOpen: PropTypes.bool,
  closeOnClick: PropTypes.bool,
  placement: PropTypes.string,
  children: PropTypes.node.isRequired,
  hasChrome: PropTypes.bool,
  tooltip: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

WithTooltip.defaultProps = {
  svg: false,
  mode: 'hover',
  startOpen: false,
  closeOnClick: false,
  placement: 'top',
  hasChrome: true,
};

export default WithTooltip;
