<template>
	<view><slot/></view>
</template>

<script>
	import {parent, children} from '@/static/utils/relation';
	export default {
		name: 'lime-painter-view',
		mixins:[children('painter'), parent('painter')],
		props: {
			css: [String, Object],
		},
		data() {
			return {
				type: 'view',
				el: {
					css: {},
					views:[]
				},
			}
		}
	}
</script>

<style>
</style>
