<?php
// Show Groups Shortcode
function group_finder() {
	ob_start();
?> 	
	<div class="mazi-container">
		<h3>Ευρετήριο Ομάδων αλληλεγγύης</h3>
		<div id="localgroup-finder"></div>
		<span class="mazi-signature">Powered by <a href="https://menoumemazi.org" tittle="menoumemazi.org" target="_blank">menoumemazi.org</a></span>
	</div>
<?php
	return ob_get_clean();
}
add_shortcode( 'group_finder', 'group_finder' );

// Show Reports Shortcode
function report_finder() {
	ob_start();
?> 	
	<div class="mazi-container">
		<div id="reportfinder"></div>
		<span class="mazi-signature">Powered by <a href="https://menoumemazi.org" tittle="menoumemazi.org" target="_blank">menoumemazi.org</a></span>
	</div>
<?php
	return ob_get_clean();
}
add_shortcode( 'report_finder', 'report_finder' );

// Show Unions Shortcode
function union_finder() {
	ob_start();
?> 	<div class="mazi-container">
		<div id="union-finder"></div>
		<span class="mazi-signature">Powered by <a href="https://menoumemazi.org" tittle="menoumemazi.org" target="_blank">menoumemazi.org</a></span>
	</div>
<?php
	return ob_get_clean();
}
add_shortcode( 'union_finder', 'union_finder' );