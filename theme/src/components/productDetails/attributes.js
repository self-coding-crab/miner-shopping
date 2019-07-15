import React from 'react';
import { themeSettings, text } from '../../lib/settings';
// Import React Table
import ReactTable from 'react-table';

const Attribute = ({ name, value }) => {
	if (
		name == 'created_at' ||
		name === 'updated_at' ||
		name === 'logo_url' ||
		name === 'miner_image_url' ||
		name === 'source'
	)
		return <div />;
	return (
		<div className="columns is-gapless is-mobile product-attribute">
			<div className="column is-5 attribute-name">
				{text['products_details_' + name]}:
			</div>
			<div className="column is-7 attribute-value">{value}</div>
		</div>
	);
};

const columns = [
	{
		Header: 'Name',
		accessor: 'name', // String-based value accessors!
		Cell: props => <span>{text['products_details_' + props.value]}:</span>
	},
	{
		Header: 'Value',
		accessor: 'value'
	}
];

const Attributes = ({ attributes }) => {
	if (attributes && attributes.length > 0) {
		const filtered_attributes = attributes.filter(
			attribute =>
				!(
					attribute.name == 'created_at' ||
					attribute.name === 'updated_at' ||
					attribute.name === 'logo_url' ||
					attribute.name === 'miner_image_url' ||
					attribute.name === 'source'
				)
		);
		return (
			<div className="product-attributes">
				<ReactTable
					data={filtered_attributes}
					columns={columns}
					className="-striped -highlight"
					style={{ background: 'white' }}
					defaultPageSize={filtered_attributes.length}
					showPagination={false}
				/>
			</div>
		);
	} else {
		return null;
	}
};
export default Attributes;
