import React from 'react';
import { NavLink } from 'react-router-dom';
import { themeSettings, text } from '../../lib/settings';
import Select from 'react-select';

class AttributeValue extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			initialData: '',
			value: '',
			defaultValue: []
		};
	}

	onChange = selected => {
		const { name, setFilterAttribute, unsetFilterAttribute } = this.props;
		const { checked } = this.state;
		console.log(checked, selected);

		if (checked.length > selected.length) {
			let difference = checked.filter(x => !selected.includes(x));
			console.log(difference);
			difference.map(item => unsetFilterAttribute(name, item.label));
		} else {
			let difference = selected.filter(x => !checked.includes(x));
			console.log(difference);
			difference.map(item => setFilterAttribute(name, item.label));
		}
	};
	static getDerivedStateFromProps = (nextProps, prevState) => {
		const checked = [],
			defaultValue = [];
		const { data } = nextProps;
		data.map(ele => {
			if (ele.checked) checked.push({ label: ele.name, value: ele.name });
			defaultValue.push({ label: ele.name, value: ele.name });
		});
		return { checked: checked, defaultValue: defaultValue };
	};
	render() {
		const { name, data } = this.props;
		const { checked, defaultValue } = this.state;
		console.log(checked, defaultValue);
		return (
			<div>
				<span>{name}</span>
				<Select
					defaultValue={checked}
					isMulti
					name={name}
					options={defaultValue}
					onChange={this.onChange}
					className="basic-multi-select"
					classNamePrefix="select"
				/>
			</div>
		);
	}
}

const AttributeFilter = ({
	attributes,
	setFilterAttribute,
	unsetFilterAttribute
}) => {
	const attributeSets = attributes.map((attribute, index) => (
		<AttributeValue
			name={attribute.name}
			data={attribute.values}
			setFilterAttribute={setFilterAttribute}
			unsetFilterAttribute={unsetFilterAttribute}
		/>
	));

	return <div className="attribute-filter">{attributeSets}</div>;
};

export default AttributeFilter;
