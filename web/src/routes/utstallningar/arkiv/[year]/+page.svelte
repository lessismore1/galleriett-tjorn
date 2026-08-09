<script lang="ts">
	import ExhibitionIndex from '$lib/components/ExhibitionIndex.svelte';

	let { data } = $props();
</script>

<ExhibitionIndex
	filter={data.filter}
	list={data.list}
	archiveYears={data.archiveYears}
	archiveYear={data.archiveYear}
	emptyLabel={data.emptyLabel}
	seo={data.seo}
/>
