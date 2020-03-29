<?php
/*
Plugin Name: Menoumemazi Plugin
Plugin URI:
Description: This plugin makes it easy to display data from menoumemazi.org. Please read 'readme.txt' for instructions on how to use it.
Version: 1.0.0
Author: Menoume mazi
Text Domain: menoumemazi
*/


/***********************
** Register Shortcodes
************************/

require_once('inc/register-shortcodes.php');


//Enqueue Scripts
function mazi_plugin_scripts(){
	global $post;
	//Scripts for Cases
	if(has_shortcode( $post->post_content, 'group_finder')|| has_shortcode( $post->post_content, 'report_finder') || has_shortcode( $post->post_content, 'union_finder')){
		wp_enqueue_style( 'mazi_css', plugin_dir_url( __FILE__ ).'finders.css', '', time() );
	}
	if(has_shortcode( $post->post_content, 'group_finder')){
		wp_enqueue_script( 'mazi_groupsjs', plugin_dir_url( __FILE__ ).'react/prod/group-finder.js', ['wp-element'], time() , 1);	
	}
	if(has_shortcode( $post->post_content, 'report_finder')){
		wp_enqueue_script( 'mazi_reportsjs', plugin_dir_url( __FILE__ ).'react/prod/report-finder.js', ['wp-element'], time() , 1);	
	}
	if(has_shortcode( $post->post_content, 'union_finder')){
		wp_enqueue_script( 'mazi_unionsjs', plugin_dir_url( __FILE__ ).'react/prod/union-finder.js', ['wp-element'], time() , 1);	
	}
}
add_action( 'wp_enqueue_scripts', 'mazi_plugin_scripts' );