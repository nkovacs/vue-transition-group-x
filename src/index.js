import TransitionGroupX from './TransitionGroupX.js'

function plugin (Vue) {
  Vue.component('TransitionGroupX', TransitionGroupX(Vue))
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
const version = '__VERSION__'
// Export all components too
export {
  version
}
