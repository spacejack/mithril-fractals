import * as m from 'mithril'
import {interpolateViridis} from 'd3-scale'

function deg (radians: number) {
	return radians * (180 / Math.PI)
}

const memoizedCalc = (function(){
	const memo = {}

	function key ({w, heightFactor, lean}: any) {
		return [w, heightFactor, lean].join('-')
	}

    return function memoizedCalc (args: any) {
		const memoKey = key(args)

		if (memo[memoKey]) {
			return memo[memoKey]
		} else {
			const {w, heightFactor, lean} = args
			const trigH = heightFactor * w
			const result = {
				nextRight: Math.sqrt(trigH ** 2 + (w * (0.5 + lean)) ** 2),
				nextLeft: Math.sqrt(trigH ** 2 + (w * (0.5 - lean)) ** 2),
				A: deg(Math.atan(trigH / ((0.5 - lean) * w))),
				B: deg(Math.atan(trigH / ((0.5 + lean) * w)))
			}

			memo[memoKey] = result
			return result
		}
	}
}())

export interface Attrs {
	w: number
	x: number
	y: number
	heightFactor: number
	lean: number
	left?: boolean
	right?: boolean
	lvl: number
	maxlvl: number
}

const pythagoras: Mithril.Component<Attrs,{}> = {
	view ({attrs: {w, x, y, heightFactor, lean, left, right, lvl, maxlvl}}) {
		if (lvl >= maxlvl || w < 1) {
			return null
		}

		const {nextRight, nextLeft, A, B} = memoizedCalc({w, heightFactor, lean})

		let rotate = ''

		if (left) {
			rotate = `rotate(${-A} 0 ${w})`
		} else if (right) {
			rotate = `rotate(${B} ${w} ${w})`
		}

		return (
			m('g', {transform: `translate(${x} ${y}) ${rotate}`}, [
				m('rect', {
					width: w, height: w, x: 0, y: 0,
					style: {
						fill: interpolateViridis(lvl / maxlvl)
					}
				}),

				m(pythagoras, {
					w: nextLeft,
					x: 0, y: -nextLeft,
					lvl: lvl + 1, maxlvl: maxlvl,
					heightFactor: heightFactor,
					lean: lean,
					left: true
				}),

				m(pythagoras, {
					w: nextRight,
					x: w - nextRight, y: -nextRight,
					lvl: lvl + 1, maxlvl: maxlvl,
					heightFactor: heightFactor,
					lean: lean,
					right: true
				})
			])
		)
	}
}

export default pythagoras
