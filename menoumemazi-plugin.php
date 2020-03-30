<?php
/*
Plugin Name: Menoumemazi Plugin
Plugin URI:  https://github.com/menoumemazi/menoumemazi-wpplugin
Description: This plugin makes it easy to display data from menoumemazi.org. Please read 'readme.txt' for instructions on how to use it.
Version: 0.1
Author: Menoume mazi
Author URI: https://menoumemazi.org
Text Domain: menoumemazi
*/


/***********************
** Register Shortcodes
************************/

require_once('inc/register-shortcodes.php');


//Enqueue Scripts
function mazi_plugin_scripts(){
	global $post;
	//Check all Scripts for css
	if(has_shortcode( $post->post_content, 'group_finder')|| has_shortcode( $post->post_content, 'report_finder') || has_shortcode( $post->post_content, 'union_finder')){
		wp_enqueue_style( 'mazi_css', plugin_dir_url( __FILE__ ).'css/finders.css' );
		//Check for Bootstrap
		if( ( ! wp_style_is( 'bootstrap', 'queue' ) ) && ( ! wp_style_is( 'bootstrap', 'done' ) ) ) {
    		wp_enqueue_style( 'mazi_boostrap', plugin_dir_url( __FILE__ ).'css/bootstrap.css' );
		}
	}
	//Script for Groups
	if(has_shortcode( $post->post_content, 'group_finder')){
		wp_enqueue_script( 'mazi_groupsjs', plugin_dir_url( __FILE__ ).'react/prod/group-finder.js', ['wp-element'], time() , 1);	
	}
	//Script for Reports
	if(has_shortcode( $post->post_content, 'report_finder')){
		wp_enqueue_script( 'mazi_reportsjs', plugin_dir_url( __FILE__ ).'react/prod/report-finder.js', ['wp-element'], time() , 1);	
	}
	//Script for Unions
	if(has_shortcode( $post->post_content, 'union_finder')){
		wp_enqueue_script( 'mazi_unionsjs', plugin_dir_url( __FILE__ ).'react/prod/union-finder.js', ['wp-element'], time() , 1);	
	}
}
add_action( 'wp_enqueue_scripts', 'mazi_plugin_scripts' );