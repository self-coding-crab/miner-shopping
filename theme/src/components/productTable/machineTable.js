import React, { Component } from 'react';
import data from './tempdata';
import DataTable from 'react-data-table-component';
import { NavLink } from 'react-router-dom';

const columns = [
	{
		name: 'ID',
		selector: 'id',
		sortable: true,
		ignoreRowClick: true,
		cell: row => <NavLink to="/category-a/product-a">{row.id}</NavLink>
	},
	{
		name: 'Brand',
		selector: 'brand',
		sortable: true
	},
	{
		name: 'Name',
		selector: 'm_name',
		sortable: true
	},
	{
		name: 'Process Node',
		selector: 'process_node',
		sortable: true
	},
	{
		name: 'Hash Rate',
		selector: 'th',
		sortable: true
	},
	{
		name: 'Power',
		selector: 'power',
		sortable: true
	},
	{
		name: 'Price',
		selector: 'price',
		sortable: true
	},
	{
		name: 'Creation Date',
		selector: 'created_at',
		sortable: true
	},
	{
		name: 'Update Date',
		selector: 'updated_at',
		sortable: true
	},
	{
		name: 'Featured',
		selector: 'featured',
		sortable: true
	}
];
class MyComponent extends Component {
	render() {
		return <DataTable title="Arnold Movies" columns={columns} data={data} />;
	}
}

export default MyComponent;
