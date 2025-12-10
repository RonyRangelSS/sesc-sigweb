import { Outlet } from 'react-router';
import Header from './components/molecules/Header';
import Footer from './components/molecules/Footer';

export default function MainLayout() {
	return (
		<>
			<Header />
			<div className='p-2'>
				<Outlet />
			</div>
			<Footer />
		</>
	);
}
