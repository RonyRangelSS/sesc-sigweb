import { FaArrowRight } from 'react-icons/fa';

type SectionProps<T> = {
	titulo: string;
	href?: string;
	items: T[];
	urlPath?: string;
	itemRenderer: (item: T) => React.ReactNode;
};

export default function Section<T>({ titulo, items, href, urlPath, itemRenderer }: SectionProps<T>) {
	return (
		<>
			<nav className='m-2 flex flex-row items-baseline justify-between border-b-4 border-[#D9D9D9]'>
				<h2 className='capitalize'>{titulo}</h2>
				{href && (
					<NavLink
						to={href}
						className='flex flex-row items-center gap-2 transition hover:scale-110 hover:cursor-pointer hover:font-medium'
					>
						<p className='text-[#FBB904]'>Ver Mais</p>
						<FaArrowRight color='#0C4484' size={24} />
					</NavLink>
				)}
			</nav>

			{(!items || items.length < 1) ? (
				<div className='m-2 flex min-h-36 items-center justify-center'>
					<p className='text-center'>
						Não conseguimos encontrar nenhum dado. Tente novamente mais tarde.
					</p>
				</div>
			) : (
				<div className='scrollbar-hide max-ro m-2 flex min-h-36 snap-x snap-mandatory gap-4 overflow-x-auto md:grid md:auto-rows-min md:grid-cols-4 md:gap-4 md:overflow-y-auto'>
					{items.map((item, idx) => itemRenderer(item))}
				</div>
			)}
		</>
	);
}
