import { Outlet } from 'react-router';
import Footer from '../../components/molecules/Footer.tsx';
import Header from '../../components/molecules/Header.tsx';
import ActiveLayersContextProvider from '../../stores/active-layers/ActiveLayersContextProvider.tsx';

export default function MapLayout() {
	return (
		<>
			<Header />
			<div
				id="map-layout-root"
				className="h-full w-screen overflow-hidden"
			>
				<ActiveLayersContextProvider>
					<Outlet />
				</ActiveLayersContextProvider>
			</div>
			<Footer />
		</>
	);
}
