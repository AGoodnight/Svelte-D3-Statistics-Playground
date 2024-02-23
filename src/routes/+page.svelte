<script>
	import Graph from '$lib/components/graph.svelte';
	import Summary from '$lib/components/summary.svelte';
	import { DataService } from '$lib/services/dataService';
	import { setContext } from 'svelte';

	setContext('dataService', new DataService());
</script>

<Graph />
<Summary />
