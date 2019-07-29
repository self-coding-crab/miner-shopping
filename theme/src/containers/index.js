import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { themeSettings } from '../lib/settings';
import MetaTags from '../components/metaTags';
import CustomProducts from '../components/products/custom';
import HomeSlider from '../components/homeSlider';

const IndexContainer = props => {
	const {
		addCartItem,
		state: { pageDetails, settings }
	} = props;

	return (
		<Fragment>
			<MetaTags
				title={pageDetails.meta_title}
				description={pageDetails.meta_description}
				canonicalUrl={pageDetails.url}
				ogTitle={pageDetails.meta_title}
				ogDescription={pageDetails.meta_description}
			/>

			<HomeSlider images={themeSettings.home_slider} />

			{pageDetails.content &&
				pageDetails.content.length > 10 && (
					<section className="section">
						<div className="container">
							<div className="content">
								<div
									dangerouslySetInnerHTML={{
										__html: pageDetails.content
									}}
								/>
							</div>
						</div>
					</section>
				)}

			<section className="section">
				<div className="container">
					<div className="title is-4">{themeSettings.home_products_title}</div>
					<CustomProducts
						sku={themeSettings.home_products_sku}
						sort={themeSettings.home_products_sort}
						limit={themeSettings.home_products_limit}
						settings={settings}
						addCartItem={addCartItem}
					/>
					<div className="title is-4">{themeSettings.home_products_title2}</div>
					<CustomProducts
						sku={themeSettings.home_products_sku}
						sort={themeSettings.home_products_sort2}
						limit={themeSettings.home_products_limit}
						settings={settings}
						addCartItem={addCartItem}
					/>
					<div className="about-us">
						<div className="header">About Us</div>
						<p className="description">
							With growing popularity of crypto-mining,more and more small
							businesses emerging that are aiming at entering the cryptocurrency
							trading and mining market. However, with a constantly increasing
							difficulty and limited supply of high-class equipment from
							reliable distributors, B many people find it hard to kick-start
							their ambitious projects.
							<br /> <br />
							Here at Asicequipment, we provide our customers with best Bitcoin,
							Litecoin and other crypto mining hardware. The ASIC equipment
							available for sale at our store is always in prime condition and
							as a trusted retailer of cryptocurrency mining hardware we offer
							various discounts and offers to our customers. <br />
							<br />
							The market for wholesale purchasing of ASIC mining hardware is so
							fragmented and as a result its so difficult to know where to get
							it and who to trust. We want to support businesses and individual
							entrepreneurs, who want to enter the industry. That is why when
							you purchase our products in bulk of 10 or more ASICs, we provide
							amazing discounts. You will not find another US-based retailer,
							with such generous offers! <br /> <br />
							If you would like to learn more about various discounts programs
							and premium offers at Asicequipmen, then contact us today and
							become part of the family!
						</p>
					</div>
				</div>
			</section>
		</Fragment>
	);
};

IndexContainer.propTypes = {
	addCartItem: PropTypes.func.isRequired,
	state: PropTypes.shape({
		settings: PropTypes.shape({}),
		pageDetails: PropTypes.shape({})
	}).isRequired
};

export default IndexContainer;
