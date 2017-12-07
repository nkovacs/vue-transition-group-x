import {
  addTransitionClass, removeTransitionClass,
  nextFrame, whenTransitionEnds,
  isValidDuration, toNumber,
  isObject
} from './transition-util'

export default function (Vue) {
  // Horrible hack to force wrapper's beforeUpdate
  // to be before the original's beforeUpdate
  const oldBeforeUpdate = Vue.config.optionMergeStrategies.beforeUpdate
  Vue.config.optionMergeStrategies.beforeUpdate = (parent, child, vm) => {
    if (parent) {
      if (!Array.isArray(child)) {
        child = [child]
      }
      return child.concat(parent)
    }
    return oldBeforeUpdate(parent, child, vm)
  }

  const TransitionGroupWrapper = Vue.extend({
    extends: Vue.component('TransitionGroup'),
    beforeUpdate () {
      const l = this.removed.length
      let i
      for (i = 0; i < l; i++) {
        this.$emit('beforeAllLeave', this.removed[i].elm)
      }
    }
  })

  Vue.config.optionMergeStrategies.beforeUpdate = oldBeforeUpdate

  return {
    name: 'TransitionGroupX',
    components: {
      TransitionGroupWrapper
    },
    props: {
      tag: String,
      moveClass: String,
      name: String,
      stagger: [Number, String, Function, Object],
      duration: [Number, String, Object],
      type: String, // not supported yet
      css: Boolean, // not supported yet
      appear: Boolean,
      // css classes
      enterClass: String,
      leaveClass: String,
      enterToClass: String,
      leaveToClass: String,
      enterActiveClass: String,
      leaveActiveClass: String,
      appearClass: String,
      appearActiveClass: String,
      appearToClass: String
    },
    created () {
      this.leaveCount = 0
      this.enterCount = 0
    },
    methods: {
      staggerMs (x, type) {
        let stagger = this.stagger
        if (isObject(stagger)) {
          stagger = stagger[type]
        }
        if (stagger === undefined) {
          return false
        }
        if (typeof stagger === 'function') {
          return stagger(x)
        }
        return toNumber(stagger) * x
      },
      durationMs (type) {
        let duration = this.duration
        if (isObject(duration)) {
          duration = duration[type]
        }
        if (duration === undefined) {
          return false
        }
        return toNumber(duration)
      },
      doStagger (count, cb, type) {
        const delay = this.staggerMs(count, type)
        if (delay === false) {
          cb()
        } else {
          setTimeout(cb, delay)
        }
      },
      beforeLeave (el) {
        addTransitionClass(el, this.transitionData.leaveActiveClass)
        addTransitionClass(el, this.transitionData.leaveClass)
      },
      leave (el, done) {
        const cb = () => {
          removeTransitionClass(el, this.transitionData.leaveToClass)
          removeTransitionClass(el, this.transitionData.leaveActiveClass)
          done()
        }
        const leaveCount = this.leaveCount
        this.leaveCount++
        nextFrame(() => {
          this.decreaseLeave()
          this.doStagger(leaveCount, () => {
            removeTransitionClass(el, this.transitionData.leaveClass)
            addTransitionClass(el, this.transitionData.leaveToClass)
            const explicitLeaveDuration = this.durationMs('leave')
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration)
            } else {
              whenTransitionEnds(el, cb)
            }
          }, 'leave')
        })
      },
      afterLeave (el) {
      },
      leaveCancelled (el) {
        removeTransitionClass(el, this.transitionData.leaveToClass)
        removeTransitionClass(el, this.transitionData.leaveActiveClass)
      },
      decreaseLeave () {
        this.leaveCount--
        if (this.leaveCount < 0) {
          this.leaveCount = 0
        }
      },
      beforeEnterOrAppear (el, type) {
        addTransitionClass(el, this.transitionData[`${type}ActiveClass`])
        addTransitionClass(el, this.transitionData[`${type}Class`])
      },
      enterOrAppear (el, done, type) {
        const cb = () => {
          removeTransitionClass(el, this.transitionData[`${type}ToClass`])
          removeTransitionClass(el, this.transitionData[`${type}ActiveClass`])
          done()
        }
        const enterCount = this.enterCount
        this.enterCount++
        nextFrame(() => {
          this.decreaseEnter()
          this.doStagger(enterCount, () => {
            removeTransitionClass(el, this.transitionData[`${type}Class`])
            addTransitionClass(el, this.transitionData[`${type}ToClass`])
            const explicitEnterDuration = this.durationMs('enter')
            if (isValidDuration(explicitEnterDuration)) {
              setTimeout(cb, explicitEnterDuration)
            } else {
              whenTransitionEnds(el, cb)
            }
          }, 'enter')
        })
      },
      afterEnterOrAppear (el, type) {
      },
      enterOrAppearCancelled (el, type) {
        removeTransitionClass(el, this.transitionData[`${type}ToClass`])
        removeTransitionClass(el, this.transitionData[`${type}ActiveClass`])
      },
      decreaseEnter () {
        this.enterCount--
        if (this.enterCount < 0) {
          this.enterCount = 0
        }
      },

      beforeEnter (el) {
        this.beforeEnterOrAppear(el, 'enter')
      },
      enter (el, done) {
        this.enterOrAppear(el, done, 'enter')
      },
      afterEnter (el) {
        this.afterEnterOrAppear(el, 'enter')
      },
      enterCancelled (el) {
        this.enterOrAppearCancelled(el, 'enter')
      },

      beforeAppear (el) {
        this.beforeEnterOrAppear(el, 'appear')
      },
      onAppear (el, done) {
        this.enterOrAppear(el, done, 'appear')
      },
      afterAppear (el) {
        this.afterEnterOrAppear(el, 'appear')
      },
      appearCancelled (el) {
        this.enterOrAppearCancelled(el, 'appear')
      },

      beforeAllLeave (el) {
        this.$emit('before-all-leave', el)
        this.$emit('beforeAllLeave', el)
      }
    },
    computed: {
      transitionData () {
        const name = this.name || 'v'
        const classes = {
          enterClass: `${name}-enter`,
          leaveClass: `${name}-leave`,
          enterToClass: `${name}-enter-to`,
          leaveToClass: `${name}-leave-to`,
          enterActiveClass: `${name}-enter-active`,
          leaveActiveClass: `${name}-leave-active`
        }
        classes.appearClass = classes.enterClass
        classes.appearActiveClass = classes.enterActiveClass
        classes.appearToClass = classes.enterToClass
        for (const key in classes) {
          if (this[key]) {
            classes[key] = this[key]
          }
        }
        return classes
      }
    },
    render (h) {
      return h('transition-group-wrapper', {
        props: {
          tag: this.tag,
          moveClass: this.moveClass,
          name: this.name,
          css: false,
          appear: this.appear
        },
        on: {
          beforeLeave: this.beforeLeave,
          leave: this.leave,
          afterLeave: this.afterLeave,
          leaveCancelled: this.leaveCancelled,
          beforeEnter: this.beforeEnter,
          enter: this.enter,
          afterEnter: this.afterEnter,
          enterCancelled: this.enterCancelled,
          beforeAppear: this.beforeAppear,
          appear: this.onAppear,
          afterAppear: this.afterAppear,
          appearCancelled: this.appearCancelled,
          beforeAllLeave: this.beforeAllLeave
        }
      }, this.$slots.default)
    }
  }
}
