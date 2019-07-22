import React from 'react';
import { NavLink } from 'react-router-dom';
import { themeSettings, text } from '../../lib/settings';
import ItemTags from './itemTags';
import ItemImage from './itemImage';
import ItemPrice from './itemPrice';
import DefaultButton from '../button';
import ReactStars from 'react-stars';

const Item = ({
	product,
	addCartItem,
	settings,
	columnCountOnMobile = 2,
	columnCountOnTablet = 3,
	columnCountOnDesktop = 4,
	columnCountOnWidescreen = 4,
	columnCountOnFullhd = 4
}) => {
	const columnCount = 12;

	const columnSizeOnMobile = columnCount / columnCountOnMobile;
	const columnSizeOnTablet = columnCount / columnCountOnTablet;
	const columnSizeOnDesktop = columnCount / columnCountOnDesktop;
	const columnSizeOnWidescreen = columnCount / columnCountOnWidescreen;
	const columnSizeOnFullhd = columnCount / columnCountOnFullhd;

	const imageHeight =
		themeSettings.list_image_max_height &&
		themeSettings.list_image_max_height > 0
			? themeSettings.list_image_max_height
			: 'auto';
	const placeholderHeight =
		themeSettings.list_image_max_height &&
		themeSettings.list_image_max_height > 0
			? themeSettings.list_image_max_height
			: 200;

	return (
		<div className="product-item">
			<NavLink to={product.path}>
				<figure className="image" style={{ height: imageHeight }}>
					<ItemTags tags={product.tags} />
					<ItemImage
						images={product.images}
						productName={product.name}
						height={placeholderHeight}
					/>
				</figure>
				<div className="content product-caption">
					<ReactStars
						className="product-stars"
						count={5}
						value={4}
						edit={false}
						size={24}
						color2={'#ffd700'}
					/>
					<div className="product-name">{product.name}</div>
					<ItemPrice product={product} settings={settings} />
					<div className="separator" />
					<div className="product-shipping">Free Shipping in 7 days</div>
					<DefaultButton width="100%" height="40px">
						ADD TO CART
					</DefaultButton>
				</div>
			</NavLink>
		</div>
	);
};

export default Item;
