import React, { Component } from 'react';

export default class DefaultButton extends Component {
	static defaultProps = {
		height: '40px'
	};
	render() {
		const { height, width, children } = this.props;
		return (
			<button
				className="default-button"
				style={{ height: height, width: width }}
			>
				{children}
			</button>
		);
	}
}
