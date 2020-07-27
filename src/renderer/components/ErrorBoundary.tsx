import React, { ErrorInfo } from "react"
import ScrollBar from "./ScrollBar"
import { connect, MapStateToProps } from "react-redux"
import { RootStore } from "~/store/reducer"
import { Theme } from "~/store/theme/themes"
import Page from "./Page"
import "twin.macro"

interface Props {}

interface StateProps {
	theme: Theme
}

// eslint-disable-next-line @typescript-eslint/ban-types
type OwnProps = React.PropsWithChildren<Props>

const mapStateToProps: MapStateToProps<StateProps, OwnProps, RootStore> = state => {
	return { theme: state.theme }
}

interface State {
	error: Error
	info: ErrorInfo
}

class ErrorBoundary extends React.Component<StateProps & OwnProps, State> {
	constructor(props: StateProps & OwnProps) {
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
		const { theme } = this.props
		if (info) {
			return (
				<ScrollBar>
					<Page tw="flex-grow">
						<button
							tw="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
							onClick={() => window.location.reload()}
						>
							Reload
						</button>
						<div tw="m-3">
							<h1 tw="text-red-500 font-black">Error!</h1>
							<p tw="whitespace-pre-wrap" style={{ color: theme.error }}>
								{error.toString()}
							</p>
							<code tw="whitespace-pre-wrap" style={{ color: theme.error }}>
								{info.componentStack}
							</code>
						</div>
					</Page>
				</ScrollBar>
			)
		}

		return this.props.children
	}
}

export default connect(mapStateToProps)(ErrorBoundary)
