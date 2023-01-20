<script>
	import { env } from '$env/dynamic/public';
	import '../styles/app.css';

	console.log(env);
</script>

<article>
	<slot />
</article>
