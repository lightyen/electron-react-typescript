import React from "react"

import { motion, Variant, useMotionValue, useTransform } from "framer-motion"
import Back from "~/components/Back"

interface Position {
    top: number
    height: number
}

// Spring configs
const onTop: Variant = { opacity: 1, zIndex: 1, transition: { duration: 0.13 } }
const flat: Variant = {
    zIndex: 0,
    opacity: 0.5,
}

const initialColors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF"]
const heights = {
    "#FF008C": 60,
    "#D309E1": 80,
    "#9C1AFF": 40,
    "#7700FF": 100,
}

interface ItemProps {
    i: number
    color: string
    setPosition(i: number, offset: Position): void
    moveItem(i: number, dragOffset: number): void
}

const Item: React.FC<ItemProps> = ({ color, setPosition, moveItem, i }) => {
    const [isDragging, setDragging] = React.useState(false)
    // We'll use a `ref` to access the DOM element that the `motion.li` produces.
    // This will allow us to measure its height and position, which will be useful to
    // decide when a dragging element should switch places with its siblings.
    const ref = React.useRef(null)

    // By manually creating a reference to `dragOriginY` we can manipulate this value
    // if the user is dragging this DOM element while the drag gesture is active to
    // compensate for any movement as the items are re-positioned.
    const dragOriginY = useMotionValue(0)

    // Update the measured position of the item so we can calculate when we should rearrange.
    React.useEffect(() => {
        setPosition(i, {
            height: ref.current.offsetHeight,
            top: ref.current.offsetTop,
        })
    })
    return (
        <motion.li
            ref={ref}
            title={color}
            className="relative mb-3 rounded"
            // If we're dragging, we want to set the zIndex of that item to be on top of the other items.
            animate={isDragging ? onTop : flat}
            style={{ background: color, height: heights[color] }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 1.12 }}
            onDragStart={() => setDragging(true)}
            onDragEnd={() => setDragging(false)}
            drag="y"
            dragElastic={0.9}
            dragOriginY={dragOriginY}
            dragConstraints={{ top: 0, bottom: 0 }}
            onDrag={(e, { point }) => moveItem(i, point.y)}
            positionTransition={({ delta }) => {
                if (isDragging) {
                    // If we're dragging, we want to "undo" the items movement within the list
                    // by manipulating its dragOriginY. This will keep the item under the cursor,
                    // even though it's jumping around the DOM.
                    dragOriginY.set(dragOriginY.get() + delta.y)
                }

                // If `positionTransition` is a function and returns `false`, it's telling
                // Motion not to animate from its old position into its new one. If we're
                // dragging, we don't want any animation to occur.
                return !isDragging
            }}
        />
    )
}

function move<T>(arr: Array<T>, from: number, to: number) {
    const a = arr.slice()
    const item = a.splice(from, 1)[0]
    a.splice(to, 0, item)
    return a
}

const buffer = 0

function clamp(min: number, max: number, value: number) {
    if (value < min) {
        return min
    }
    if (value > max) {
        return max
    }
    return value
}

export const findIndex = (i: number, yOffset: number, positions: Position[]) => {
    let target = i
    const { top, height } = positions[i]
    const bottom = top + height

    // If moving down
    if (yOffset > 0) {
        const nextItem = positions[i + 1]
        if (nextItem === undefined) return i

        const swapOffset = Math.abs(bottom - (nextItem.top + nextItem.height / 2)) + buffer
        if (yOffset > swapOffset) target = i + 1

        // If moving up
    } else if (yOffset < 0) {
        const prevItem = positions[i - 1]
        if (prevItem === undefined) return i

        const prevBottom = prevItem.top + prevItem.height
        const swapOffset = Math.abs(top - (prevBottom - prevItem.height / 2)) + buffer
        if (yOffset < -swapOffset) target = i - 1
    }

    return clamp(0, positions.length, target)
}

const Example = () => {
    const [colors, setColors] = React.useState(initialColors)

    // We need to collect an array of height and position data for all of this component's
    // `Item` children, so we can later us that in calculations to decide when a dragging
    // `Item` should swap places with its siblings.
    const positions = React.useRef<Position[]>([]).current
    const setPosition = (i: number, offset: Position) => (positions[i] = offset)

    // Find the ideal index for a dragging item based on its position in the array, and its
    // current drag offset. If it's different to its current index, we swap this item with that
    // sibling.
    const moveItem = (i: number, dragOffset: number) => {
        const targetIndex = findIndex(i, dragOffset, positions)
        if (targetIndex !== i) setColors(move(colors, i, targetIndex))
    }

    return (
        <ul
            className="relative"
            style={{
                width: 300,
            }}
        >
            {colors.map((color, i) => (
                <Item key={color} i={i} color={color} setPosition={setPosition} moveItem={moveItem} />
            ))}
        </ul>
    )
}

const Demo: React.FC = () => {
    const constraintsRef = React.useRef()
    const y = useMotionValue(0)
    const background = useTransform(y, [0, 800], ["#000", "#2233ee"])
    const [isDragging, setDragging] = React.useState(false)

    return (
        <div className="container-fluid">
            <motion.div
                ref={constraintsRef}
                className="mx-3 d-flex justify-content-center position-relative d-flex rounded"
                style={{ minWidth: 300, maxWidth: 800, minHeight: 300, border: "1px solid #2233ee" }}
            >
                <motion.div
                    style={{
                        background,
                        height: 100,
                        width: 100,
                        borderRadius: "1rem",
                        position: "absolute",
                    }}
                    // onClick={e => y.set(100)}
                    drag="y"
                    dragOriginY={y}
                    onDrag={(e, { point }) => {
                        console.log(point)
                    }}
                    dragMomentum={false}
                    onDragStart={() => setDragging(true)}
                    onDragEnd={() => setDragging(false)}
                    initial={{
                        borderRadius: "18%",
                    }}
                    whileTap={{
                        scale: 1.1,
                        boxShadow: "3px 3px 6px 0px #555555",
                    }}
                    // dragTransition={{ bounceStiffness: 30, bounceDamping: 200 }}
                    positionTransition={({ delta }) => {
                        console.log(delta)

                        // If `positionTransition` is a function and returns `false`, it's telling
                        // Motion not to animate from its old position into its new one. If we're
                        // dragging, we don't want any animation to occur.
                        return !isDragging
                    }}
                    dragConstraints={constraintsRef}
                />
                <h1 className="align-self-center">Drag</h1>
            </motion.div>
        </div>
    )
}

const Page: React.FC = () => {
    return (
        <div className="flex h-screen justify-center items-center">
            <Back to="/" className="fixed left-0" />
            <Example />
            <Demo />
        </div>
    )
}
Page.displayName = "ReactDnD"

export default Page
