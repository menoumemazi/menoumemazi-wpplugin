<?php
// Show Groups Shortcode
function group_finder($atts) {
	$atts = array_change_key_case((array)$atts, CASE_LOWER);
	$wporg_atts = shortcode_atts([
			'title' => 'Ευρετήριο Ομάδων Aλληλεγγύης',
	], $atts, $tag);
	ob_start();
?> 	
	<div class="mazi-container">
		<h3><?php echo esc_html__($wporg_atts['title'], 'wporg') ;?></h3>
		<div id="localgroup-finder"></div>
		<span class="mazi-signature">Powered by <a href="https://menoumemazi.org" tittle="menoumemazi.org" target="_blank">menoumemazi.org</a></span>
	</div>
<?php
	return ob_get_clean();
}
add_shortcode( 'group_finder', 'group_finder' );

// Show Reports Shortcode
function report_finder($atts) {
	$atts = array_change_key_case((array)$atts, CASE_LOWER);
	$wporg_atts = shortcode_atts([
			'title' => 'Ευρετήριο Καταγγελιών Εργοδοτικής Αυθαιρεσίας',
	], $atts, $tag);
	ob_start();
?> 	
	<div class="mazi-container">
		<h3><?php echo esc_html__($wporg_atts['title'], 'wporg') ;?></h3>
		<div id="reportfinder"></div>
		<span class="mazi-signature">Powered by <a href="https://menoumemazi.org" tittle="menoumemazi.org" target="_blank">menoumemazi.org</a></span>
	</div>
<?php
	return ob_get_clean();
}
add_shortcode( 'report_finder', 'report_finder' );

// Show Unions Shortcode
function union_finder($atts) {
	$atts = array_change_key_case((array)$atts, CASE_LOWER);
	$wporg_atts = shortcode_atts([
			'title' => 'Ευρετήριο Σωματείων',
	], $atts, $tag);
	ob_start();
?> 	<div class="mazi-container">
		<h3><?php echo esc_html__($wporg_atts['title'], 'wporg') ;?></h3>
		<div id="union-finder"></div>
		<span class="mazi-signature">Powered by <a href="https://menoumemazi.org" tittle="menoumemazi.org" target="_blank">menoumemazi.org</a></span>
	</div>
<?php
	return ob_get_clean();
}
add_shortcode( 'union_finder', 'union_finder' );