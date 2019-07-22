import React from 'react';
import { NavLink } from 'react-router-dom';
import { themeSettings, text } from '../../lib/settings';

export default class SearchBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value,
			buttonState: false,
			hasInputFocus: false
		};
	}

	handleChange = event => {
		this.setState({ value: event.target.value });
	};

	handleKeyPress = e => {
		if (e.keyCode === 13 || e.which === 13) {
			this.handleSearch();
		}
	};

	handleKeyDown = e => {
		if (e.keyCode === 27) {
			this.handleClear();
		}
	};

	handleSearch = () => {
		this.props.onSearch(this.state.value);
	};

	handleClear = () => {
		this.setState({ value: '' });
		this.props.onSearch('');
	};

	handleButtonFocus = () => {
		const { hasButtonFocus } = this.state;
		this.productInput.focus();
		this.setState({ hasButtonFocus: !hasButtonFocus });
	};

	handleBlur = () => {
		this.setState({ hasInputFocus: false, hasButtonFocus: false, value: '' });
	};

	render() {
		const placeholderText =
			themeSettings.search_placeholder &&
			themeSettings.search_placeholder.length > 0
				? themeSettings.search_placeholder
				: text.searchPlaceholder;

		return (
			<div className="search-content">
				<fieldset>
					<input
						ref={input => {
							this.productInput = input;
						}}
						className="search-input"
						type="text"
						id="search-bar"
						placeholder={placeholderText}
						value={this.state.value}
						onChange={this.handleChange}
						onKeyPress={this.handleKeyPress}
						onKeyDown={this.handleKeyDown}
						// onFocus={this.handleFocus}
						// onBlur={this.handleBlur}
					/>
					<div className="search-icon-container">
						<div id="search-icon" onClick={this.handleButtonFocus}>
							<i className="fa fa-search" />
						</div>
					</div>
				</fieldset>
			</div>
		);
	}
}
