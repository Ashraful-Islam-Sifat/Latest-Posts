<?php
/**
 * Plugin Name:       Latest Posts
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Sifat
 * Text Domain:       latest-posts
 *
 * @package           create-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

 function create_block_render_latest_posts($attributes) {
	$args = array(
		'post_per_page' => $attributes['numberOfPosts'],
		'post_status' => 'publish'
	);
	$rescent_posts = get_posts( $args );
	
	$posts = '<ul '. get_block_wrapper_attributes() .'>';
	foreach($rescent_posts as $post) {
		$title = get_the_title( $post ) ? get_the_title( $post ) : __('(No title)', 'latest-posts') ;
		$permalink = get_permalink( $post );
		$excerpt = get_the_excerpt( $post );

		$posts .= '<li>';

		if($attributes["displayFeaturedImage"] && has_post_thumbnail( $post )){
			$posts .= get_the_post_thumbnail( $post, 'large' );
		}

		$posts .= '<h2><a href="' .esc_url( $permalink ) . '">' . $title . '</a></h2>';

		$posts .= '<time datetime="' . esc_attr( get_the_date( 'c', $post ) ) . '">' . esc_html( get_the_date( '', $post ) ) . '</time>';

		if(!empty($excerpt)) {
			$posts .= '<p>' . $excerpt . '</p>';
		}

		$posts .= '</li>';
	}

	$posts .= '</ul>';
	return $posts;
 }
function create_block_latest_posts_block_init() {
	register_block_type_from_metadata(  __DIR__ . '/build', array(
		'render_callback' => 'create_block_render_latest_posts'
	)  );
}
add_action( 'init', 'create_block_latest_posts_block_init' );