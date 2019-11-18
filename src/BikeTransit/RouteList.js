import React, { useState, useRef } from 'react';
import BikeRouteCard from './BikeRouteCard';
import MixedRouteCard from './MixedRouteCard';

const RouteList = ({
	bikeRoute,
	mixedRoute,
	origin,
	destination,
}) => {
	const [expandedCard, setExpandedCard] = useState(null);
	const [activeStep, setActiveStep] = useState(0);
	const bikeRef = useRef(null);
	const mixedRef = useRef(null);
	
	const handleToggle = (card) => (event, isExpanded, ref) => {
		setActiveStep(0);
		setExpandedCard(isExpanded ? card : null);
		if (isExpanded) {
			scrollIntoView(ref);
		}
	}

	const scrollIntoView = (ref) => {
		window.setTimeout(() => {
			window.scrollTo({
				top: ref.current.offsetTop + 80,
				left: 0,
				behavior: 'smooth',
			});
		}, 300);
	}

	return (
		<>
			<BikeRouteCard
				route={bikeRoute}
				isExpanded={expandedCard === 'bikeRoute'}
				onToggle={handleToggle('bikeRoute', bikeRef)}
				ref={bikeRef}
			/>
			<MixedRouteCard
				route={mixedRoute}
				origin={origin}
				destination={destination}
				isExpanded={expandedCard === 'mixedRoute'}
				onToggle={handleToggle('mixedRoute', mixedRef)}
				activeStep={activeStep}
				setActiveStep={setActiveStep}
				ref={mixedRef}
			/>
		</>
	);
}

export default RouteList;