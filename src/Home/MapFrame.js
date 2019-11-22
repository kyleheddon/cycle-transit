import React, {
	useEffect,
	useRef,
	useState,
} from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
	}
}));

const MapFrame = ({
	header,
	main,
	footer,
}) => {
	const [mainHeight, setMainHeight] = useState('100vh');
	const containerRef = useRef(null);
	const headerRef = useRef(null);
	const footerRef = useRef(null);
	const classes = useStyles();

	useEffect(() => {
		const containerHeight = containerRef.current.getBoundingClientRect().height;
		const headerHeight = headerRef.current.getBoundingClientRect().height;
		const footerHeight = footerRef.current
			? footerRef.current.getBoundingClientRect().height
			: 0;

		setMainHeight(containerHeight - (headerHeight + footerHeight) + 'px');
	}, [header, main, footer]);
	return (
		<div
			ref={containerRef}
			style={{
				height: '100vh',
				width: '100%',
				position: 'relative',
			}}
		>
			{header &&
				<header ref={headerRef}>
					{header}
				</header>
			}
			<section
				style={{
					height: mainHeight,
					position: 'relative',
				}}
			>
				{main}
			</section>
			{footer &&
				<footer
					className={classes.root}
					ref={footerRef}
				>
						{footer}
				</footer>
			}
		</div>
	);
}

export default MapFrame;