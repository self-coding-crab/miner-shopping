import React, { Fragment } from 'react';
import ImageGallery from 'react-image-gallery';
import { themeSettings, text } from '../../lib/settings';
import Item from './item';
import LoadMore from './loadMore';
import _ from 'lodash';
import Slider from 'react-slick';

const ProductList = ({
	products,
	addCartItem,
	settings,
	loadMoreProducts,
	hasMore,
	loadingProducts,
	loadingMoreProducts,
	isCentered,
	className = 'columns is-multiline is-mobile products',
	columnCountOnMobile,
	columnCountOnTablet,
	columnCountOnDesktop,
	columnCountOnWidescreen,
	columnCountOnFullhd
}) => {
	const item = products => (
		<div>
			{products.map(product => (
				<Item
					key={product.id}
					product={product}
					addCartItem={addCartItem}
					settings={settings}
					columnCountOnMobile={columnCountOnMobile}
					columnCountOnTablet={columnCountOnTablet}
					columnCountOnDesktop={columnCountOnDesktop}
					columnCountOnWidescreen={columnCountOnWidescreen}
					columnCountOnFullhd={columnCountOnFullhd}
				/>
			))}
		</div>
	);
	const sliderSettings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		draggable: false,
		dots: false
	};
	return (
		<div className="products">
			<Slider {...sliderSettings}>
				{products.map(product => (
					<Item
						key={product.id}
						product={product}
						addCartItem={addCartItem}
						settings={settings}
						columnCountOnMobile={columnCountOnMobile}
						columnCountOnTablet={columnCountOnTablet}
						columnCountOnDesktop={columnCountOnDesktop}
						columnCountOnWidescreen={columnCountOnWidescreen}
						columnCountOnFullhd={columnCountOnFullhd}
					/>
				))}
			</Slider>
		</div>
	);
};

export default ProductList;
