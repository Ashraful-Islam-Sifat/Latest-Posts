import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import { format, dateI18n, getSettings } from '@wordpress/date';
import { PanelBody, ToggleControl, QueryControls } from '@wordpress/components';
import { select, useSelect } from '@wordpress/data';
import './editor.scss';

export default function Edit({attributes, setAttributes}) {
	const {numberOfPosts, displayFeaturedImage, order, orderBy, categories} = attributes;

	const catIDs = categories && categories.length > 0 ? categories.map((cat)=> cat.id) : [];

	const posts = useSelect(
		(select) => {
			return select('core').getEntityRecords('postType', 'post', {
				per_page: numberOfPosts,
				_embed: true,
				order,
				orderby: orderBy,
				categories: catIDs
			});
		},
		[numberOfPosts, order, orderBy, categories]
	);

	const allCats = useSelect((select) => {
		return select('core').getEntityRecords('taxonomy', 'category', {
			per_page: -1,
		});
	}, []);
	
	const catSuggestions = {};
	if (allCats) {
		for (let i = 0; i < allCats.length; i++) {
			const cat = allCats[i];
			catSuggestions[cat.name] = cat;
		}
	}	

	const onDisplayFeaturedImageChange = (value) => {
		setAttributes({displayFeaturedImage: value})
	}

	const onNumberOfItemChange = (value) => {
		setAttributes( { numberOfPosts: value } )
	}

	const onCategoryChange = (values) => {
		const hasNoSuggestions = values.some((value) => typeof value == 'string' && !catSuggestions[value]);
		if (hasNoSuggestions) return;

		const updateCats = values.map((token)=> {
			return typeof token == 'string' ? catSuggestions[token] : token;
		})
		
		setAttributes({categories: updateCats})
	}

	return (
		<>
		<InspectorControls>
			<PanelBody>
				<ToggleControl 
				    label={__('Display Featured Image', 'latest-posts')} 
					checked={displayFeaturedImage}
					onChange={onDisplayFeaturedImageChange}
				/>
				<QueryControls 
				    numberOfItems={numberOfPosts} 
					onNumberOfItemsChange={onNumberOfItemChange}
					maxItems={10}
					minItems={1}
					orderBy={orderBy}
					onOrderByChange= {(v)=> setAttributes({ orderBy: v })}
					order={order}
					onOrderChange= {(v)=> setAttributes({ order: v })}
					categorySuggestions= {catSuggestions}
					selectedCategories={categories}					
					onCategoryChange={onCategoryChange}
				/>
			</PanelBody>
		</InspectorControls>
		<ul { ...useBlockProps() }>
			{posts && posts.map( (post) => {
				const featuredImage = 
				    post._embedded &&
					post._embedded['wp:featuredmedia'] &&
					post._embedded['wp:featuredmedia'].length > 0 &&
					post._embedded['wp:featuredmedia'][0];
				return(
				    <li key={post.id}>
						{displayFeaturedImage && featuredImage && (
							<img
							    src={featuredImage.source_url}
								alt={featuredImage.alt_text}
							/> 
						)
						}
				    	<h4>
				    		<a href={post.link}>
								{
									post.title.rendered ? (
										<RawHTML>{post.title.rendered}</RawHTML>
									):(
										__('(No title)', 'latest-posts')
									)
								}
								
				    		</a>
				    	</h4>
						{post.date_gmt && (
							<time dateTime={format('c', post.date_gmt)}>
								{dateI18n(
									getSettings().formats.date,
									post.date_gmt
								)}
							</time>
						)}
						{post.excerpt.rendered && (
							<RawHTML>{post.excerpt.rendered}</RawHTML>
						) }
				    </li>
			    )
			} )}
		</ul>
		</>
	);
}
