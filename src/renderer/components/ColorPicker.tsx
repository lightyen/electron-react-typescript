import React from "react"
import chroma from "chroma-js"

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

const ColorPicker = React.forwardRef<
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
		<div ref={picker} className="color-picker" style={{ width: 460 }}>
			<div ref={result} className="color-picker-result" style={{ height: 46 }}>
				<div className="color-picker-alpha-bg1" />
				<div className="color-picker-result-bg" />
				<div className="absolute w-full h-full flex items-center justify-center select-text">
					<div ref={resultText} className="px-1" />
					<button className="px-2 rounded-lg focus:outline-none hover:text-gray-600" onClick={changeText}>
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
})

export default ColorPicker
