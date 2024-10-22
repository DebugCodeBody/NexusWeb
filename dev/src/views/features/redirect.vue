<script lang="ts" setup>

const Route = useRoute();
const Router = useRouter();


Router.replace({
  path: `/${Route.path}`,
  query: Route.query
})


</script>
