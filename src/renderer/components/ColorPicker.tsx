import React from "react"
import chroma from "chroma-js"

import styled from "styled-components"
import tw from "twin.macro"

const ColorPicker = styled.div`
	--selected-color: #ffffff;
	--selected-hue: #ff0000;
	--palette-pointer-x: 0;
	--palette-pointer-y: 0;
	--hue-slider-y: 0;
	--alpha-slider-y: 0;
	${tw`p-3`}
	width: 340px;
	box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 2px, rgba(0, 0, 0, 0.3) 0px 4px 8px;
	background: var(--color-picker-background);
	> #result {
		position: relative;
		height: 46px;
		color: var(--result-text-color);
		> #alpha {
			${tw`w-full h-full absolute`}
			background-image: linear-gradient(45deg, #888 25%, transparent 25%),
				linear-gradient(-45deg, #888 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #888 75%),
				linear-gradient(-45deg, transparent 75%, #888 75%);
			background-size: 16px 16px;
			background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
		}
		> #bg {
			${tw`w-full h-full absolute`}
			background: var(--selected-color);
			opacity: var(--selected-alpha);
		}
		> #text {
			${tw`absolute w-full h-full flex items-center justify-center select-text`}
			#switch {
				${tw`px-2 rounded-lg`}
				:focus {
					${tw`outline-none`}
				}
				:hover {
					${tw`text-gray-600`}
				}
			}
		}
	}
`

const Panel = styled.div`
	height: 200px;
	margin-top: 0.75rem;
	display: grid;
	gap: 0.75rem;
	grid-gap: 0.75rem;
	grid-template-columns: 1fr 50px 50px;
	> #palette {
		${tw`relative bg-white`}
		> #pointer {
			${tw`absolute w-4 h-4 rounded-full`}
			border-color: #f7fafc;
			background-color: var(--selected-color);
			border-width: 2px;
			transform: translate(
				calc(var(--palette-pointer-x, 0) * 1px - 8px),
				calc(var(--palette-pointer-y, 0) * 1px - 8px)
			);
		}
		> #bg {
			${tw`w-full h-full absolute`}
			background: var(--selected-hue);
			> #bg1 {
				${tw`w-full h-full absolute`}
				background: linear-gradient(to right, #fff 0%, transparent 100%);
			}
			> #bg2 {
				${tw`w-full h-full absolute`}
				background: linear-gradient(to bottom, transparent 0%, #000 100%);
			}
		}
	}
	> #alpha {
		${tw`relative h-full bg-white`}
		> #bg1 {
			${tw`w-full h-full absolute`}
			background-image: linear-gradient(45deg, #888 25%, transparent 25%),
				linear-gradient(-45deg, #888 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #888 75%),
				linear-gradient(-45deg, transparent 75%, #888 75%);
			background-size: 16px 16px;
			background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
		}
		> #bg2 {
			${tw`w-full h-full absolute`}
			background: linear-gradient(to bottom, var(--selected-color) 0%, transparent 100%);
		}
		> #slider {
			${tw`absolute rounded-full`}
			position: absolute;
			border-color: #f7fafc;
			border-width: 2px;
			width: calc(100% + 4px);
			left: -2px;
			height: 10px;
			transform: translate(0px, calc(var(--alpha-slider-y, 0) * 1px - 5px));
		}
	}
	> #hue {
		${tw`relative bg-white`}
		> #bg {
			${tw`w-full h-full absolute`}
			background: linear-gradient(
				to bottom,
				hsl(0, 100%, 50%),
				hsl(60, 100%, 50%),
				hsl(120, 100%, 50%),
				hsl(180, 100%, 50%),
				hsl(240, 100%, 50%),
				hsl(300, 100%, 50%),
				hsl(360, 100%, 50%)
			);
		}
		> #slider {
			${tw`absolute rounded-full`}
			border-color: #f7fafc;
			background-color: var(--selected-hue);
			border-width: 2px;
			width: calc(100% + 4px);
			left: -2px;
			height: 10px;
			transform: translate(0px, calc(var(--hue-slider-y, 0) * 1px - 5px));
		}
	}
`

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

function useMousemove(ref: React.MutableRefObject<HTMLElement>, callback: (e: MouseEvent) => void) {
	const cb = React.useRef<(e: MouseEvent) => void>()
	React.useEffect(() => {
		cb.current = callback
	}, [callback])
	React.useEffect(() => {
		const el = ref.current
		const onmousemove = (e: MouseEvent) => {
			e.preventDefault()
			cb.current(e)
		}
		const onmousedown = (e: MouseEvent) => {
			e.preventDefault()
			window.addEventListener("mousemove", onmousemove)
			window.addEventListener("mouseup", onmouseup)
			cb.current(e)
		}
		const onmouseup = (e: MouseEvent) => {
			e.preventDefault()
			window.removeEventListener("mousemove", onmousemove)
		}
		el.addEventListener("mousedown", onmousedown)
		return () => {
			el.removeEventListener("mousedown", onmousedown)
			window.removeEventListener("mousemove", onmousemove)
			window.removeEventListener("mouseup", onmouseup)
		}
	}, [ref])
}

function useCombinedRefs(
	...refs: Array<React.MutableRefObject<HTMLDivElement> | ((instance: HTMLDivElement) => void)>
) {
	const targetRef = React.useRef<HTMLDivElement>()
	React.useEffect(() => {
		for (const ref of refs) {
			if (!ref) continue
			if (typeof ref === "function") {
				ref(targetRef.current)
			} else {
				ref.current = targetRef.current
			}
		}
	}, [refs])
	return targetRef
}

interface Props {
	onChange?: (color: chroma.Color) => void
	defaultValue?: string | chroma.Color
}

export default React.forwardRef<
	HTMLDivElement,
	Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & Props
>(({ onChange, defaultValue = chroma("#ff0000") }, ref) => {
	const picker = useCombinedRefs(React.useRef<HTMLDivElement>(), ref)
	const palette = React.useRef<HTMLDivElement>()
	const alpha = React.useRef<HTMLDivElement>()
	const hue = React.useRef<HTMLDivElement>()
	const result = React.useRef<HTMLDivElement>()
	const resultText = React.useRef<HTMLDivElement>()

	const handleChange = React.useRef<(color: chroma.Color) => void>()
	React.useEffect(() => {
		handleChange.current = onChange
	}, [onChange])

	const onchange = React.useCallback(() => {
		if (handleChange.current) {
			const root = picker.current
			const alpha = parseFloat(root.style.getPropertyValue("--selected-alpha"))
			const color = chroma(root.style.getPropertyValue("--selected-color")).alpha(alpha)
			handleChange.current(color.alpha(alpha))
		}
	}, [picker])

	const updateText = React.useCallback(() => {
		const el = resultText.current
		const root = picker.current
		const alpha = parseFloat(root.style.getPropertyValue("--selected-alpha"))
		const color = chroma(root.style.getPropertyValue("--selected-color")).alpha(alpha)
		switch (el.dataset["type"]) {
			case "hex":
				el.innerText = color.alpha(alpha).hex()
				break
			case "rgba":
				el.innerText = color.alpha(alpha).css()
				break
			case "hsla":
				el.innerText = color.alpha(alpha).css("hsl")
				break
		}
		const bg = chroma(document.body.style.backgroundColor)
		if (chroma.scale([bg, color])(alpha).luminance() > 0.5) {
			result.current.style.setProperty("--result-text-color", "#1a202c")
		} else {
			result.current.style.setProperty("--result-text-color", " #f7fafc")
		}
	}, [picker])

	React.useEffect(() => {
		const root = picker.current
		const c = typeof defaultValue === "string" ? chroma(defaultValue) : defaultValue
		const h = c.get("hsl.h") || 0
		root.style.setProperty("--selected-hue", chroma.hsl(h, 1, 0.5).hex())
		root.style.setProperty("--selected-color", c.hex())
		const el = palette.current
		const elRect = el.getBoundingClientRect()
		root.style.setProperty("--palette-pointer-x", (elRect.width * c.get("hsv.s")).toString())
		root.style.setProperty("--palette-pointer-y", (elRect.height * (1 - c.get("hsv.v"))).toString())
		root.style.setProperty("--hue-slider-y", ((h / 360) * elRect.height).toString())
		root.style.setProperty("--selected-alpha", c.alpha().toString())
		root.style.setProperty("--alpha-slider-y", (elRect.height * (1 - c.alpha())).toString())
		const bg = chroma(document.body.style.backgroundColor)
		root.style.setProperty(
			"--color-picker-background",
			bg.luminance() > 0.5 ? bg.darken(0.5).css() : bg.brighten(0.5).css(),
		)
		console.log(bg.brighten(0.5).hex())
		resultText.current.dataset["type"] = "hex"
		updateText()
	}, [picker, updateText, defaultValue])

	useMousemove(palette, (e: MouseEvent) => {
		const el = palette.current
		const root = picker.current
		const elRect = el.getBoundingClientRect()
		let x = clamp(e.clientX - elRect.left, 0, elRect.width)
		if (e.ctrlKey) {
			x = parseFloat(root.style.getPropertyValue("--palette-pointer-x"))
		}
		let y = clamp(e.clientY - elRect.top, 0, elRect.height)
		if (e.shiftKey) {
			y = parseFloat(root.style.getPropertyValue("--palette-pointer-y"))
		}
		const h = chroma(root.style.getPropertyValue("--selected-hue")).get("hsv.h")
		const selectedColor = chroma.hsv(h, x / elRect.width, 1 - y / elRect.height)
		root.style.setProperty("--selected-color", selectedColor.hex())
		root.style.setProperty("--palette-pointer-x", x.toString())
		root.style.setProperty("--palette-pointer-y", y.toString())
		updateText()
		onchange()
	})

	useMousemove(hue, (e: MouseEvent) => {
		const el = hue.current
		const root = picker.current
		const pl = palette.current
		const elRect = el.getBoundingClientRect()
		const y = clamp(e.clientY - elRect.top, 0, elRect.height)
		const selectedHue = chroma.hsl((y / elRect.height) * 360, 1, 0.5)
		root.style.setProperty("--selected-hue", selectedHue.css("hsl"))
		root.style.setProperty("--hue-slider-y", y.toString())

		const plRect = pl.getBoundingClientRect()
		const px = root.style.getPropertyValue("--palette-pointer-x")
		const py = root.style.getPropertyValue("--palette-pointer-y")
		const c1 = chroma.mix("#fff", "#000", parseFloat(py) / plRect.height, "rgb")
		const c2 = chroma.mix(selectedHue, "#000", parseFloat(py) / plRect.height, "rgb")
		const selectedColor = chroma.mix(c1, c2, parseFloat(px) / plRect.width, "rgb")
		root.style.setProperty("--selected-color", selectedColor.hex())
		updateText()
		onchange()
	})
	useMousemove(alpha, (e: MouseEvent) => {
		const el = alpha.current
		const root = picker.current
		const elRect = el.getBoundingClientRect()
		const y = clamp(e.clientY - elRect.top, 0, elRect.height)
		const selectedAlpha = 1 - y / elRect.height
		root.style.setProperty("--selected-alpha", selectedAlpha.toString())
		root.style.setProperty("--alpha-slider-y", y.toString())
		updateText()
		onchange()
	})

	function changeText() {
		const el = resultText.current
		const root = picker.current
		const color = chroma(root.style.getPropertyValue("--selected-color"))
		const alpha = parseFloat(root.style.getPropertyValue("--selected-alpha"))
		switch (el.dataset["type"]) {
			case "hex":
				el.dataset["type"] = "rgba"
				el.innerText = color.alpha(alpha).css()
				break
			case "rgba":
				el.dataset["type"] = "hsla"
				el.innerText = color.alpha(alpha).css("hsl")
				break
			case "hsla":
				el.dataset["type"] = "hex"
				el.innerText = color.alpha(alpha).hex()
				break
		}
	}

	return (
		<ColorPicker ref={picker}>
			<div id="result" ref={result}>
				<div id="alpha" />
				<div id="bg" />
				<div id="text">
					<div ref={resultText} />
					<button id="switch" onClick={changeText}>
						<svg
							id="i-options"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 32 32"
							width="16"
							height="16"
							fill="none"
							stroke="currentcolor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
						>
							<path d="M28 6 L4 6 M28 16 L4 16 M28 26 L4 26 M24 3 L24 9 M8 13 L8 19 M20 23 L20 29" />
						</svg>
					</button>
				</div>
			</div>
			<Panel>
				<div id="palette" ref={palette}>
					<div id="bg">
						<div id="bg1" />
						<div id="bg2" />
						<div id="bg2" />
					</div>
					<div id="pointer" />
				</div>
				<div id="alpha" ref={alpha}>
					<div id="bg1" />
					<div id="bg2" />
					<div id="slider" />
				</div>
				<div ref={hue} id="hue">
					<div id="bg" />
					<div id="slider" />
				</div>
			</Panel>
		</ColorPicker>
	)
})
