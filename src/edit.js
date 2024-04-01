import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import { format, dateI18n, getSettings } from '@wordpress/date';
import { useSelect } from '@wordpress/data';
import './editor.scss';

export default function Edit({attributes}) {
	const {numberOfPosts, displayFeaturedImage} = attributes;
	const posts = useSelect(
		(select) => {
			return select('core').getEntityRecords('postType', 'post', {
				per_page: numberOfPosts,
				_embed: true
			});
		},
		[numberOfPosts]
	);

	return (
		<ul { ...useBlockProps() }>
			{posts && posts.map( (post) => {
				const featuredImage = 
				    post._embedded &&
					post._embedded['wp:featuredmedia'] &&
					post._embedded['wp:featuredmedia'].length > 0 &&
					post._embedded['wp:featuredmedia'][0];
					console.log(featuredImage);
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
	);
}
