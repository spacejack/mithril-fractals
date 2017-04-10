import * as m from 'mithril'
import {scaleLinear} from 'd3-scale'
import pythagoras from './pythagoras'

export interface Attrs {
}

interface State {
	svgWidth: number
	svgHeight: number
	svgOffsetX: number
	svgOffsetY: number
	currentMax: number
	baseW: number
	heightFactor: number
	lean: number
	realMax: 11
	onMouseMove (this: State, event: MouseEvent): void
	next (this: State): void
}

export default {
	svgWidth: 1280,
	svgHeight: 600,
	svgOffsetX: 0,
	svgOffsetY: 0,
	currentMax: 0,
	realMax: 11,
	baseW: 80,
	heightFactor: 0,
	lean: 0,

	onMouseMove (event) {
		// Offset mouse to svg origin
		const x = event.clientX - this.svgOffsetX
		const y = event.clientY - this.svgOffsetY
		const scaleFactor = scaleLinear()
			.domain([this.svgHeight, 0])
			.range([0, .8])
		const scaleLean = scaleLinear()
			.domain([0, this.svgWidth / 2, this.svgWidth])
			.range([.5, 0, -.5])
		this.heightFactor = scaleFactor(y)
		this.lean = scaleLean(x)
	},

	oncreate({dom}) {
		const rc = dom.querySelector('svg')!.getBoundingClientRect()
		this.svgOffsetX = rc.left
		this.svgOffsetY = rc.top
		this.next()
	},

    next() {
        const currentMax = this.currentMax
        if (currentMax < this.realMax) {
            this.currentMax = currentMax + 1
			setTimeout(() => {
				this.next()
				m.redraw()
			}, 500)
        }
    },

	view() {
		return m('.app',
			{
				onmousemove: (e: MouseEvent) => {this.onMouseMove(e)}
			},
			m('.app-header',
				m('.app-logo', m.trust("<em>m</em>(")),
				m('h1', "This is a dancing Pythagoras tree"),
				m('p.about',
					m('span', "Made with "),
					m('a', {href: 'http://mithriljs.org/'}, "Mithril 1.0"),
					m('span', " | "),
					m('a', {href: 'https://github.com/spacejack/mithril-fractals'}, "source")
				)
			),
			m('p.app-intro',
				m('svg',
					{
						//viewBox: `${-this.svgWidth / 2} ${-this.svgHeight / 2} ${this.svgWidth} ${this.svgHeight}`,
						version: '1.1',
						xmlns: 'http://www.w3.org/2000/svg',
						width: this.svgWidth,
						height: this.svgHeight,
						ref: 'svg',
						style: {border: "1px solid lightgray"}
					},
					m(pythagoras, {
						w: this.baseW,
						heightFactor: this.heightFactor,
						lean: this.lean,
						x: this.svgWidth / 2 - 40,
						y: this.svgHeight - this.baseW,
						lvl: 0,
						maxlvl: this.currentMax
					})
				)
			)
		)
	}
} as m.Comp<Attrs,State>
