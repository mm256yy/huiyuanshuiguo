<template>
</template>

<script>
	import {parent, children} from '@/static/utils/relation';
	export default {
		name: 'lime-painter-qrcode',
		mixins:[children('painter')],
		props: {
			css: [String, Object],
			text: String
		},
		data() {
			return {
				type: 'qrcode',
				el: {
					css: {},
					text: null
				},
			}
		}
	}
</script>

<style>
</style>
