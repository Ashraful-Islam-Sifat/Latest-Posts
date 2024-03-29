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
	echo '<pre>';
	var_dump($rescent_posts);
	echo '</pre>';
 }
function create_block_latest_posts_block_init() {
	register_block_type_from_metadata(  __DIR__ . '/build', array(
		'render_callback' => 'create_block_render_latest_posts'
	)  );
}
add_action( 'init', 'create_block_latest_posts_block_init' );