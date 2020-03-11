import React from "react"

import { motion, TargetAndTransition, useMotionValue } from "framer-motion"
import Back from "~/components/Back"
import ScrollBar from "~/components/ScrollBar"

interface Position {
    top: number
    height: number
}

// function clamp(min: number, max: number, value: number) {
//     if (value < min) {
//         return min
//     }
//     if (value > max) {
//         return max
//     }
//     return value
// }

function distance(a: number, b: number): number {
    return Math.abs(a - b)
}

export const findIndex = (i: number, yOffset: number, positions: Position[]) => {
    let target = i
    const { top, height } = positions[i]
    const bottom = top + height
    const threshold = positions[i].height / 4

    // If moving down
    if (yOffset > 0) {
        const next = i + 1
        // if item is the last
        if (positions.length === next) {
            return i
        }
        const nextItem = positions[next]
        const swapOffset = distance(bottom, nextItem.top + nextItem.height / 2) + threshold
        if (yOffset > swapOffset) target = next
    } else if (yOffset < 0) {
        const prev = i - 1
        // if item is the first
        if (i === 0) {
            return i
        }
        const prevItem = positions[prev]
        const swapOffset = -(distance(top, prevItem.top + prevItem.height / 2) + threshold)
        if (yOffset < swapOffset) target = prev
    }
    return target
    // return clamp(0, positions.length, target);
}

const drag: TargetAndTransition = { zIndex: 3 }
const flat: TargetAndTransition = {
    zIndex: 0,
}
const hover: TargetAndTransition = { zIndex: 1 }
const tap: TargetAndTransition = { zIndex: 2 }

interface Item {
    key: string
    background: string
    width?: number
    height?: number
    content?: React.ReactNode
}

const source: Item[] = [
    { key: "#F44336", background: "#F44336", width: 100, height: 60 },
    { key: "#E91E63", background: "#E91E63", width: 200, height: 80 },
    { key: "#9C27B0", background: "#9C27B0", width: 80, height: 40 },
    { key: "#673AB7", background: "#673AB7", width: 330, height: 90 },
    { key: "#3F51B5", background: "#3F51B5", width: 100, height: 40 },
    { key: "#2196F3", background: "#2196F3", width: 220, height: 20 },
    { key: "#03A9F4", background: "#03A9F4", width: 180, height: 60 },
    {
        key: "#00BCD4",
        background: "#00BCD4",
        content: <div className="p-3">Dynamic Width/Height</div>,
    },
    { key: "#009688", background: "#009688", width: 300, height: 50 },
]

interface DraggableItemProps {
    i: number
    data: Item
    setPosition(i: number, offset: Position): void
    moveItem(i: number, dragOffset: number): void
}

function DraggableItem({ data, setPosition, moveItem, i }: DraggableItemProps) {
    const [isDragging, setDragging] = React.useState(false)
    // We'll use a `ref` to access the DOM element that the `motion.li` produces.
    // This will allow us to measure its height and position, which will be useful to
    // decide when a dragging element should switch places with its siblings.
    const ref = React.useRef<HTMLLIElement>()

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

    const { key, content, background, ...rest } = data

    return (
        <motion.li
            ref={ref}
            className="relative flex z-0"
            style={{
                listStyle: "none",
                color: "#fff",
            }}
            animate={isDragging ? drag : flat}
            whileHover={hover}
            whileTap={tap}
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            onDragStart={() => setDragging(true)}
            onDragEnd={() => setDragging(false)}
            dragElastic={1}
            dragOriginY={dragOriginY}
            dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
            onDrag={(e, { point }) => {
                moveItem(i, point.y)
            }}
            positionTransition={({ delta }) => {
                if (isDragging) {
                    // If we're dragging, we want to "undo" the items movement within the list
                    // by manipulating its dragOriginY. This will keep the item under the cursor,
                    // even though it's jumping around the DOM.
                    // console.log(dragOriginY.get(), color, delta.y)
                    dragOriginY.set(dragOriginY.get() + delta.y)
                }

                // If `positionTransition` is a function and returns `false`, it's telling
                // Motion not to animate from its old position into its new one. If we're
                // dragging, we don't want any animation to occur.
                return !isDragging
            }}
        >
            <motion.div
                // If we're dragging, we want to set the zIndex of that item to be on top of the other items.
                title={data.background}
                className="relative mb-3 rounded-lg"
                animate={
                    isDragging ? { boxShadow: "3px 3px 8px 0px #eeeecc" } : { boxShadow: "0px 0px 0px 0px #eeeecc" }
                }
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 1.12 }}
                style={{
                    cursor: "pointer",
                    color: "#fff",
                    background,
                    ...rest,
                }}
            >
                {content}
            </motion.div>
        </motion.li>
    )
}

function move<T>(arr: Array<T>, from: number, to: number) {
    const a = arr.slice()
    const item = a.splice(from, 1)[0]
    a.splice(to, 0, item)
    return a
}

const Example = () => {
    const [data, setData] = React.useState(() => [...source])

    // We need to collect an array of height and position data for all of this component's
    // `Item` children, so we can later us that in calculations to decide when a dragging
    // `Item` should swap places with its siblings.
    const positions = React.useRef<Position[]>([]).current
    const setPosition = (i: number, offset: Position) => {
        positions[i] = offset
    }

    // Find the ideal index for a dragging item based on its position in the array, and its
    // current drag offset. If it's different to its current index, we swap this item with that
    // sibling.
    const moveItem = (i: number, dragOffset: number) => {
        const targetIndex = findIndex(i, dragOffset, positions)
        if (targetIndex !== i) {
            setData(move(data, i, targetIndex))
        }
    }

    return (
        <ul>
            {data.map((d, i) => (
                <DraggableItem key={d.key} i={i} data={d} setPosition={setPosition} moveItem={moveItem} />
            ))}
        </ul>
    )
}

const MyItem: React.FC = () => {
    const [isDragging, setDragging] = React.useState(false)

    const y = useMotionValue(0)

    const ref = React.useRef<HTMLDivElement>()
    React.useEffect(() => {
        // console.log(ref.current.offsetTop, ref.current.offsetHeight)
    })

    return (
        <motion.div
            ref={ref}
            className="w-10 h-10 mb-3 rounded-lg bg-green-600 relative"
            animate={isDragging ? drag : flat}
            whileHover={hover}
            whileTap={tap}
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            onDragStart={() => setDragging(true)}
            onDragEnd={() => setDragging(false)}
            onDrag={(e, { point }) => {
                //
            }}
            dragElastic={1}
            dragTransition={{ bounceStiffness: 1000, bounceDamping: 60 }}
            dragOriginY={y}
            // dragMomentum={false} // 慣性
            positionTransition={({ delta }) => {
                if (isDragging) {
                    // console.log(delta)
                    // y.set(y.get())
                    console.log(delta)
                }
                // If `positionTransition` is a function and returns `false`, it's telling
                // Motion not to animate from its old position into its new one. If we're
                // dragging, we don't want any animation to occur.
                return !isDragging
            }}
        />
    )
}

const Page: React.FC = () => {
    const arr = [0, 1, 2, 3, 4]

    return (
        <ScrollBar className="p-3 pl-12 flex justify-around">
            <Example />
            <div
                className="relative m-3 mt-0 rounded"
                style={{
                    minWidth: 300,
                    maxWidth: 800,
                    minHeight: 315,
                    background: "#2a2d33",
                    border: "1px solid #2233ee",
                }}
            >
                {arr.map(v => (
                    <MyItem key={v} />
                ))}
            </div>

            <Back to="/" className="fixed left-0" />
        </ScrollBar>
    )
}
Page.displayName = "ReactDnD"

export default Page
