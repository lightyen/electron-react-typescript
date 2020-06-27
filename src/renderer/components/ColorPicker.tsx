import React from "react"
import chroma from "chroma-js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons/faExchangeAlt"
function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

function useMousemove(ref: React.MutableRefObject<HTMLElement>, callback: (e: MouseEvent) => void) {
	React.useEffect(() => {
		const el = ref.current
		const onmousemove = (e: MouseEvent) => callback(e)
		const onmousedown = (e: MouseEvent) => {
			window.addEventListener("mousemove", onmousemove)
			window.addEventListener("mouseup", onmouseup)
			callback(e)
		}
		const onmouseup = (e: MouseEvent) => {
			window.removeEventListener("mousemove", onmousemove)
		}
		el.addEventListener("mousedown", onmousedown)
		return () => {
			el.removeEventListener("mousedown", onmousedown)
			window.removeEventListener("mousemove", onmousemove)
			window.removeEventListener("mouseup", onmouseup)
		}
	}, [ref, callback])
}

const ColorPicker: React.FC = () => {
	const picker = React.useRef<HTMLDivElement>()
	const palette = React.useRef<HTMLDivElement>()
	const alpha = React.useRef<HTMLDivElement>()
	const hue = React.useRef<HTMLDivElement>()
	const result = React.useRef<HTMLDivElement>()
	const resultColor = React.useRef<HTMLDivElement>()
	const resultText = React.useRef<HTMLDivElement>()

	const updateText = React.useCallback(() => {
		const el = resultText.current
		const root = picker.current
		const color = chroma(root.style.getPropertyValue("--selected-color"))
		const alpha = parseFloat(root.style.getPropertyValue("--selected-alpha"))
		if (alpha < 1.0) {
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
		} else {
			switch (el.dataset["type"]) {
				case "hex":
					el.innerText = color.hex()
					break
				case "rgba":
					el.innerText = color.css()
					break
				case "hsla":
					el.innerText = color.css("hsl")
					break
			}
		}
		const bg = chroma(document.body.style.backgroundColor)
		if (chroma.contrast(chroma.scale([bg, color])(alpha), "white") < 3) {
			result.current.style.setProperty("--result-text-color", "#1a202c")
		} else {
			result.current.style.setProperty("--result-text-color", " #f7fafc")
		}
	}, [])

	React.useEffect(() => {
		const root = picker.current
		root.style.setProperty("--selected-hue", "#ff0000")
		root.style.setProperty("--selected-color", "#ffffff")
		root.style.setProperty("--selected-alpha", "1.0")
		root.style.setProperty("--palette-pointer-x", "0")
		root.style.setProperty("--palette-pointer-y", "0")
		resultText.current.innerText = "#ffffff"
		resultText.current.dataset["type"] = "hex"
	}, [])

	useMousemove(
		palette,
		React.useCallback(
			(e: MouseEvent) => {
				const el = palette.current
				const root = picker.current
				const elRect = el.getBoundingClientRect()
				const x = clamp(e.clientX - elRect.left, 0, elRect.width)
				const y = clamp(e.clientY - elRect.top, 0, elRect.height)

				const c1 = chroma.scale(["#fff", "#000"])(y / elRect.height)
				const c2 = chroma.scale([root.style.getPropertyValue("--selected-hue"), "#000"])(y / elRect.height)
				const selectedColor = chroma.scale([c1, c2])(x / elRect.width)
				root.style.setProperty("--selected-color", selectedColor.hex())
				root.style.setProperty("--palette-pointer-x", x.toString())
				root.style.setProperty("--palette-pointer-y", y.toString())
				updateText()
			},
			[updateText],
		),
	)

	useMousemove(
		hue,
		React.useCallback(
			(e: MouseEvent) => {
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
			},
			[updateText],
		),
	)
	useMousemove(
		alpha,
		React.useCallback(
			(e: MouseEvent) => {
				const el = alpha.current
				const root = picker.current
				const elRect = el.getBoundingClientRect()
				const y = clamp(e.clientY - elRect.top, 0, elRect.height)
				const selectedAlpha = 1 - y / elRect.height
				root.style.setProperty("--selected-alpha", selectedAlpha.toString())
				root.style.setProperty("--alpha-slider-y", y.toString())
				updateText()
			},
			[updateText],
		),
	)

	return (
		<div ref={picker} className="color-picker" style={{ width: 460 }}>
			<div ref={result} className="color-picker-result" style={{ height: 46 }}>
				<div className="color-picker-alpha-bg1" />
				<div ref={resultColor} className="color-picker-result-bg" />
				<div className="absolute w-full h-full flex items-center justify-center select-text">
					<div ref={resultText} className="px-1" />
					<button
						className="px-2 rounded-lg focus:outline-none hover:text-gray-600"
						onClick={() => {
							const el = resultText.current
							const root = picker.current
							const color = chroma(root.style.getPropertyValue("--selected-color"))
							const alpha = parseFloat(root.style.getPropertyValue("--selected-alpha"))
							switch (el.dataset["type"]) {
								case "hex":
									el.dataset["type"] = "rgba"
									alpha < 1.0
										? (el.innerText = color.alpha(alpha).css())
										: (el.innerText = color.css())
									break
								case "rgba":
									el.dataset["type"] = "hsla"
									alpha < 1.0
										? (el.innerText = color.alpha(alpha).css("hsl"))
										: (el.innerText = color.css("hsl"))
									break
								case "hsla":
									el.dataset["type"] = "hex"
									alpha < 1.0
										? (el.innerText = color.alpha(alpha).hex())
										: (el.innerText = color.hex())
									break
							}
						}}
					>
						<FontAwesomeIcon icon={faExchangeAlt} />
					</button>
				</div>
			</div>
			<div className="color-picker-controls" style={{ height: 300 }}>
				<div ref={palette} className="color-picker-palette">
					<div className="color-picker-palette-bg">
						<div className="color-picker-palette-bg1" />
						<div className="color-picker-palette-bg2" />
						<div className="color-picker-palette-bg2" />
					</div>
					<div className="color-picker-palette-pointer" />
				</div>
				<div ref={alpha} className="color-picker-alpha">
					<div className="color-picker-alpha-bg1" />
					<div className="color-picker-alpha-bg2" />
					<div className="color-picker-alpha-slider" />
				</div>
				<div ref={hue} className="color-picker-hue">
					<div className="color-picker-hue-bg" />
					<div className="color-picker-hue-slider" />
				</div>
			</div>
		</div>
	)
}

export default ColorPicker
