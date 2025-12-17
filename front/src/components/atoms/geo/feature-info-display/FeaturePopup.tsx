import { Popup } from 'react-leaflet';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { FetchedFeatureInfo } from '@/types/geo/FetchedFeatureInfo';

export type FeaturePopupProps = {
	fetchedFeatures: FetchedFeatureInfo[];
};


export default function FeaturePopup({ fetchedFeatures }: FeaturePopupProps) {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<Popup>
			<div className="w-64 max-h-96 px-2 pb-2 flex flex-col" style={{maxWidth: '18rem', maxHeight: '24rem'}}>
				<div className="flex flex-col h-full">
					<nav
						className={twMerge(
							'scrollbar-custom z-10 flex overflow-x-auto border-b bg-surface',
						)}
						style={{flex: '0 0 auto'}}
					>
						{fetchedFeatures.map((feature, index) => (
							<button
								key={`${feature.layerInfo.namespace}:${feature.layerInfo.name}`}
								className={`px-3 py-1 text-sm ${
									activeTab === index
										? 'border-primary/50 border-b-2 font-bold'
										: 'text-on-surface'
								}`}
								onClick={() => setActiveTab(index)}
							>
								{`${feature.layerInfo.namespace}:${feature.layerInfo.name}`}
							</button>
						))}
					</nav>
					{/* Conteúdo scrollável abaixo da tab */}
					<div className="mt-2 flex-1 overflow-y-auto" style={{minHeight: 0}}>
						{fetchedFeatures[activeTab]?.features.map((feature) => (
							<div
								key={feature.id}
								className='mb-2 rounded-lg border p-2 shadow-sm'
							>
								<p className='text-xs text-gray-500'>ID: {feature.id}</p>
								<ul className='mt-1 space-y-1 text-sm'>
									{Object.entries(feature.properties).map(([key, value]) => (
										<li key={key}>
											<span className='font-semibold'>{key}:</span>{' '}
											{String(value)}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</div>
		</Popup>
	);
}