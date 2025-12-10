import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import MapLayout from './pages/map/MapLayout.tsx';
import Map from './pages/map/Map.tsx';
import Home from './pages/home/Home.tsx';
import MainLayout from './MainLayout.tsx';
import PostDetails from './pages/posts/details/PostDetails.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<BrowserRouter>
				<Routes>
					<Route
						path='/'
						element={<MainLayout />}
					>
						<Route
							index
							element={<Home />}
						/>
						<Route
							path='/posts/:itemId'
							element={<PostDetails />}
						/>
					</Route>
					<Route
						path='/mapa'
						element={<MapLayout />}
					>
						<Route
							path='/mapa'
							element={<Map />}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	</StrictMode>
);
