<script>
import Tag from '@/components/global/Tag.vue'

export default {
  name: 'TagItem',
  extends: Tag,
  props: {
    tag: { type: Object, default: () => {} },
  },
}
</script>
