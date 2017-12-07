import Vue from 'vue/dist/vue.js'
import TransitionGroupX from 'src/TransitionGroupX.js'
import { createVM } from '../helpers/utils.js'

describe('TransitionGroupX', function () {
  const componentOptions = {
    components: { TransitionGroupX: TransitionGroupX(Vue) },
    data () {
      return {
        replaced: false,
        replaceCount: 0,
        items: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' },
          { id: 4, name: 'Item 4' },
          { id: 5, name: 'Item 5' },
          { id: 6, name: 'Item 6' },
          { id: 7, name: 'Item 7' }
        ]
      }
    },
    methods: {
      beforeAllLeave (el) {
        // Make sure leaving element doesn't move.
        el.style.top = el.offsetTop + 'px'
      },
      replaceFirst () {
        if (this.items[0].id === 1) {
          Vue.set(this.items, 0, { id: 11, name: 'Item 11' })
        } else if (this.items[0].id === 11) {
          Vue.set(this.items, 0, { id: 1, name: 'Item 1' })
        }
      },
      toggleFirst () {
        if (this.items[0].id === 1) {
          this.items.splice(0, 1)
        } else if (this.items[0].id !== 11) {
          this.items.splice(0, 0, { id: 1, name: 'Item 1' })
        }
      },
      replace () {
        this.replaceCount++
        const replaceCount = ' replaced ' + this.replaceCount
        if (this.replaced) {
          this.items = [
            { id: 1, name: 'Item 1' + replaceCount },
            { id: 2, name: 'Item 2' + replaceCount },
            { id: 3, name: 'Item 3' + replaceCount },
            { id: 4, name: 'Item 4' + replaceCount },
            { id: 5, name: 'Item 5' + replaceCount },
            { id: 6, name: 'Item 6' + replaceCount },
            { id: 7, name: 'Item 7' + replaceCount }
          ]
        } else {
          this.items = [
            { id: 11, name: 'Item 11' + replaceCount },
            { id: 12, name: 'Item 12' + replaceCount },
            { id: 13, name: 'Item 13' + replaceCount },
            { id: 14, name: 'Item 14' + replaceCount },
            { id: 15, name: 'Item 15' + replaceCount },
            { id: 16, name: 'Item 16' + replaceCount },
            { id: 17, name: 'Item 17' + replaceCount }
          ]
        }
        this.replaced = !this.replaced
      }
    }
  }

  const buttons = `
<button type="button" @click="replace">replace</button>
<button type="button" @click="replaceFirst">replace first</button>
<button type="button" @click="toggleFirst">toggle first</button>
`

  const items = `
  <li class="item" v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
`

  it('with stagger', function () {
    // eslint-disable-next-line no-unused-vars
    const vm = createVM(this, `
${buttons}
<transition-group-x class="itemlist" tag="ul" name="item" :absolute-leaving="true" :stagger="100" @before-all-leave="beforeAllLeave">
  ${items}
</transition-group-x>
`,
      componentOptions
    )

    vm.$el.querySelector('.itemlist').tagName.should.eql('UL')
    vm.$el.querySelectorAll('.item').length.should.eql(7)
  })

  it('with stagger and explicit duration', function () {
    // eslint-disable-next-line no-unused-vars
    const vm = createVM(this, `
${buttons}
<transition-group-x
  class="itemlist" tag="ul" name="item"
  stagger="100"
  @before-all-leave="beforeAllLeave"
  :duration="{enter: 400, leave: 200}"
>
  ${items}
</transition-group-x>
`,
      componentOptions
    )

    vm.$el.querySelector('.itemlist').tagName.should.eql('UL')
    vm.$el.querySelectorAll('.item').length.should.eql(7)
  })

  it('without stagger', function () {
    // eslint-disable-next-line no-unused-vars
    const vm = createVM(this, `
${buttons}
<transition-group-x class="itemlist" tag="ul" name="item" @before-all-leave="beforeAllLeave">
  ${items}
</transition-group-x>
`,
      componentOptions
    )

    vm.$el.querySelector('.itemlist').tagName.should.eql('UL')
    vm.$el.querySelectorAll('.item').length.should.eql(7)
  })

  it('custom classes', function () {
    // eslint-disable-next-line no-unused-vars
    const vm = createVM(this, `
${buttons}
<transition-group-x
  class="itemlist" tag="ul" name="item"
  enter-class="item-enter-2"
  leave-class="item-leave-2"
  enter-to-class="item-enter-to-2"
  leave-to-class="item-leave-to-2"
  enter-active-class="item-enter-active-2"
  leave-active-class="item-leave-active-2"
  move-class="item-move-2"
>
  ${items}
</transition-group-x>
`,
      componentOptions
    )

    vm.$el.querySelector('.itemlist').tagName.should.eql('UL')
    vm.$el.querySelectorAll('.item').length.should.eql(7)
  })
})
