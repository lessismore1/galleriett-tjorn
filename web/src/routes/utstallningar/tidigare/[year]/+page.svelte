<script lang="ts">
	import ExhibitionIndex from '$lib/components/ExhibitionIndex.svelte';

	let { data } = $props();
</script>

<ExhibitionIndex
	filter={data.filter}
	list={data.list}
	pastYears={data.pastYears}
	pastYear={data.pastYear}
	emptyLabel={data.emptyLabel}
	seo={data.seo}
/>
