import React, { ErrorInfo } from "react"
import ScrollBar from "./ScrollBar"
interface Props {}

interface State {
	error: Error
	info: ErrorInfo
}

export class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { error: null, info: null }
	}

	static getDerivedStateFromError(error: Error) {
		return { error }
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		this.setState({ error, info })
		console.error(error, info)
	}

	render() {
		const { error, info } = this.state
		if (info) {
			return (
				<ScrollBar>
					<div className="m-3">
						<h1 className="text-red-500 font-black">Error!</h1>
						<p className="whitespace-pre-wrap text-red-500">{error.toString()}</p>
						<code className="whitespace-pre-wrap text-red-500">{info.componentStack}</code>
					</div>
				</ScrollBar>
			)
		}

		return this.props.children
	}
}
