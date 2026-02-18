export default {
  beforeMount(el, binding) {
    el.__clickOutside__ = (e) => {
      if (!el.contains(e.target)) {
        binding.value(e)
      }
    }
    document.addEventListener("click", el.__clickOutside__)
  },
  unmounted(el) {
    document.removeEventListener("click", el.__clickOutside__)
    el.__clickOutside__ = null
  },
}
