import { FaAlignJustify, FaHome, FaMap } from 'react-icons/fa';
import { NavLink } from 'react-router';
import { twMerge } from 'tailwind-merge';

export default function Footer() {
	return (
		<div
			className={twMerge(
				'sticky bottom-0 z-50 flex w-full flex-row items-center',
				'bg-primary justify-between px-8 py-4'
			)}
		>
			<NavLink to='/'>
				<FaHome
					size={32}
					className='text-on-primary'
				/>
			</NavLink>
			<NavLink to='/mapa'>
				<FaMap
					size={32}
					className='text-on-primary'
				/>
			</NavLink>
			<FaAlignJustify
				size={32}
				className='text-on-primary hover:cursor-pointer'
			/>
		</div>
	);
}
