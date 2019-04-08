<script>
export default {
  fetch ({ route, query, redirect }) {
    if (route.path === '/search') {
      return redirect({ path: '/search/feed', query })
    }
  },
}
</script>
