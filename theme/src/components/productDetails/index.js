import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import * as helper from '../../lib/helper';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { themeSettings, text } from '../../lib/settings';
import ViewedProducts from '../products/viewed';
import Breadcrumbs from './breadcrumbs';
import DiscountCountdown from './discountCountdown';
import AddToCartButton from './addToCartButton';
import Attributes from './attributes';
import Gallery from './gallery';
import Options from './options';
import Price from './price';
import Quantity from './quantity';
import RelatedProducts from './relatedProducts';
import Tags from './tags';
import Axios from 'axios';
const muiTheme = getMuiTheme({
	fontFamily: 'Roboto, sans-serif',
	appBar: {}
});
const Description = ({ description }) => (
	<div
		className="product-content"
		dangerouslySetInnerHTML={{ __html: description }}
	/>
);
const MinerInfoCard = ({ title, price }) => (
	<div className="card">
		<div className="header">{title}</div>
		<div className="price">
			{Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD'
			}).format(price)}
		</div>
	</div>
);
export default class ProductDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedOptions: {},
			selectedVariant: null,
			isAllOptionsSelected: false,
			quantity: 1,
			ecost: 0.065,
			asic: 9,
			gross_income: 0,
			income_per_kwh: 0.1,
			hardware_cost: 0.02,
			month: 12,
			operation_profit: 0.01,
			machine_id: null,
			price: 0
		};

		this.onOptionChange = this.onOptionChange.bind(this);
		this.findVariantBySelectedOptions = this.findVariantBySelectedOptions.bind(
			this
		);
		this.addToCart = this.addToCart.bind(this);
		this.checkSelectedOptions = this.checkSelectedOptions.bind(this);
	}

	componentDidMount() {
		const { product } = this.props;
		console.log(product);
		if (product.length > 0) {
			const value = product.attributes.filter(item => item.name === 'id');
			console.log(product);
			this.setState({
				machine_id: value[0].value,
				price: product.regular_price
			});
			// this.getAdditionalInfo(value[0].value);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.machine_id !== this.state.machine_id) {
			this.getAdditionalInfo(this.state.machine_id); //example calling redux action
		}
	}

	getAdditionalInfo = () => {
		const { ecost, asic, price, machine_id } = this.state;
		Axios.get(
			`https://cryptomining.tools/compare-mining-hardware/xhr/miner_calc.json?id=${machine_id}&ecost=${ecost}&asic=${asic}&price=${price}`
		).then(res => {
			const { data } = res;
			if (data.success) {
				this.setState({
					gross_income: data.data.gross_income,
					income_per_kwh: data.data.income_per_kwh,
					hardware_cost: data.data.hardware_cost,
					operation_profit: data.data.operation_profit
				});
			}
		});
	};
	onOptionChange(optionId, valueId) {
		let { selectedOptions } = this.state;

		if (valueId === '') {
			delete selectedOptions[optionId];
		} else {
			selectedOptions[optionId] = valueId;
		}

		this.setState({ selectedOptions: selectedOptions });
		this.findVariantBySelectedOptions();
		this.checkSelectedOptions();
	}

	findVariantBySelectedOptions() {
		const { selectedOptions } = this.state;
		const { product } = this.props;
		for (const variant of product.variants) {
			const variantMutchSelectedOptions = variant.options.every(
				variantOption =>
					selectedOptions[variantOption.option_id] === variantOption.value_id
			);
			if (variantMutchSelectedOptions) {
				this.setState({ selectedVariant: variant });
				return;
			}
		}

		this.setState({ selectedVariant: null });
	}

	setQuantity = quantity => {
		this.setState({ quantity: quantity });
	};

	addToCart() {
		const { product, addCartItem } = this.props;
		const { selectedVariant, quantity } = this.state;

		let item = {
			product_id: product.id,
			quantity: quantity
		};

		if (selectedVariant) {
			item.variant_id = selectedVariant.id;
		}

		addCartItem(item);
	}

	checkSelectedOptions() {
		const { selectedOptions } = this.state;
		const { product } = this.props;

		const allOptionsSelected =
			Object.keys(selectedOptions).length === product.options.length;
		this.setState({ isAllOptionsSelected: allOptionsSelected });
	}
	handleParamChange = (param, value) => {
		this.setState({ [param]: value });
		this.getAdditionalInfo();
	};
	render() {
		const { product, settings, categories } = this.props;
		const { selectedVariant, isAllOptionsSelected, asic, ecost } = this.state;
		const maxQuantity =
			product.stock_status === 'discontinued'
				? 0
				: product.stock_backorder
					? themeSettings.maxCartItemQty
					: selectedVariant
						? selectedVariant.stock_quantity
						: product.stock_quantity;

		if (product) {
			const {
				gross_income,
				income_per_kwh,
				hardware_cost,
				operation_profit
			} = this.state;
			return (
				<MuiThemeProvider muiTheme={muiTheme}>
					<section className="section section-product">
						<div className="container">
							<h1 className="title is-4 product-name">{product.name}</h1>
							{themeSettings.show_product_breadcrumbs && (
								<Breadcrumbs product={product} categories={categories} />
							)}
							<div className="columns">
								<div className="column is-7">
									<Gallery images={product.images} />
								</div>
								<div className="column is-5">
									<div className="content">
										<Tags tags={product.tags} />
										<Price
											product={product}
											variant={selectedVariant}
											isAllOptionsSelected={isAllOptionsSelected}
											settings={settings}
										/>

										{themeSettings.show_discount_countdown &&
											product.on_sale === true && (
												<DiscountCountdown product={product} />
											)}

										<Options
											options={product.options}
											onChange={this.onOptionChange}
										/>
										<div className="product-price-dec">
											<Quantity
												maxQuantity={maxQuantity}
												onChange={this.setQuantity}
											/>
											<div className="button-addtocart">
												<AddToCartButton
													product={product}
													variant={selectedVariant}
													addCartItem={this.addToCart}
													isAllOptionsSelected={isAllOptionsSelected}
												/>
											</div>
										</div>
										<div className="additional-info">
											<div className="filter-field">
												<div>
													<TextField
														type="text"
														value={this.state.ecost}
														onChange={e =>
															this.handleParamChange('ecost', e.target.value)
														}
														floatingLabelText="Electricity Cost"
													/>
												</div>
												<div>
													<TextField
														type="text"
														value={this.state.asic}
														onChange={e =>
															this.handleParamChange('asic', e.target.value)
														}
														floatingLabelText="ASIC Useful Life"
													/>
												</div>
											</div>
											<div className="result-field mt-4">
												<br />
												<br />
												<strong>
													{`Your Gross Income Per Day might be: ${new Intl.NumberFormat(
														'en-US',
														{ style: 'currency', currency: 'USD' }
													).format(gross_income)}.`}{' '}
													<br />
													<br />
													{`You could earn ${new Intl.NumberFormat('en-US', {
														style: 'currency',
														currency: 'USD'
													}).format(
														income_per_kwh
													)} per kWh with this miner.`}{' '}
													<br />
													<br />
													{`If you bought this miner for ${new Intl.NumberFormat(
														'en-US',
														{ style: 'currency', currency: 'USD' }
													).format(
														hardware_cost
													)}, and run it for ${asic} months, it will be as though the miner cost you ${new Intl.NumberFormat(
														'en-US',
														{ style: 'currency', currency: 'USD' }
													).format(ecost)} per kwh that it runs.`}
													<br />
													<br />
													{`The Operation Profit for this miner might be around ${new Intl.NumberFormat(
														'en-US',
														{ style: 'currency', currency: 'USD' }
													).format(
														operation_profit
													)} for every kWh that the miner is running.`}
												</strong>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="section section-product-description">
						<div className="container">
							<div className="content">
								<span className="header">Miner Info</span>
								<div className="columns">
									<div className="column is-6">
										<Description description={product.description} />
										<div className="miner--info__card">
											<MinerInfoCard
												title="Gross Income Per Day (BTC)"
												price={gross_income}
											/>
											<MinerInfoCard
												title="Income/kWh (BTC)"
												price={income_per_kwh}
											/>
											<MinerInfoCard
												title="Hardware Cost/kWh (BTC)"
												price={hardware_cost}
											/>
											<MinerInfoCard
												title="Operation Profit/kWh (BTC)"
												price={operation_profit}
											/>
										</div>
									</div>
									<div className="column is-6">
										<Attributes attributes={product.attributes} />
									</div>
								</div>
							</div>
						</div>
					</section>

					<RelatedProducts
						settings={settings}
						addCartItem={this.addToCart}
						ids={product.related_product_ids}
						limit={10}
					/>

					{themeSettings.show_viewed_products && (
						<ViewedProducts
							settings={settings}
							addCartItem={this.addToCart}
							product={product}
							limit={themeSettings.limit_viewed_products || 4}
						/>
					)}

					{/*		{themeSettings.disqus_shortname &&
					themeSettings.disqus_shortname !== '' && (
						<section className="section">
							<div className="container">
								<Disqus
									shortname={themeSettings.disqus_shortname}
									identifier={product.id}
									title={product.name}
									url={product.url}
								/>
							</div>
						</section>
					)} */}
				</MuiThemeProvider>
			);
		} else {
			return null;
		}
	}
}
