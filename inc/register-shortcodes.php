<?php
// Show Groups Shortcode
function group_finder() {
	ob_start();
?> 	
	<div id="localgroup-finder"></div>
<?php
	return ob_get_clean();
}
add_shortcode( 'group_finder', 'group_finder' );

// Show Reports Shortcode
function report_finder() {
	ob_start();
?> 	
	<div id="reportfinder"></div>
<?php
	return ob_get_clean();
}
add_shortcode( 'report_finder', 'report_finder' );

// Show Unions Shortcode
function union_finder() {
	ob_start();
?> 	
	<div id="union-finder"></div>
<?php
	return ob_get_clean();
}
add_shortcode( 'union_finder', 'union_finder' );