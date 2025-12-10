import { NavLink } from 'react-router';
import { STRAPI_BASE_URL } from '../../api/Strapi';

type Tag = { nome: string; cor: string };

export type SectionItemProps = {
	id: string;
	titulo: string;
	descricao: string;
	img: {
		url: string;
		formats?: { thumbnail?: { url: string }; small?: { url: string } };
	};
	textoAlt: string;
	tag?: Tag;
};

export default function SectionItem({
	id,
	titulo,
	descricao,
	img,
	textoAlt,
	tag,
}: SectionItemProps) {
	console.log(`${STRAPI_BASE_URL}${img.formats?.thumbnail?.url ?? img.url}`);

	return (
		<div className='no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-webkit-overflow-scrolling:touch]'>
			<NavLink
				to={`posts/${id}`}
				draggable={false}
				className='relative h-72 w-60 shrink-0 snap-center overflow-hidden rounded-2xl border border-gray-300 bg-white p-4 shadow-md'
			>
				<div className='relative h-32 w-full overflow-hidden rounded-t-2xl shadow'>
					<img
						src={`${STRAPI_BASE_URL}${img.formats?.thumbnail?.url ?? img.url}`}
						draggable={false}
						alt={textoAlt}
						className='h-full w-full object-cover'
					/>
				</div>

				<h2 className='mt-4 px-2 text-xl leading-tight font-normal text-black'>
					{titulo}
				</h2>
				{tag && (
					<span
						className='font-semibold, my-1 rounded-full px-2 py-1 text-xs'
						style={{ backgroundColor: tag.cor }}
					>
						{tag.nome}
					</span>
				)}
				<p className='mt-2 px-2 text-justify text-sm leading-tight text-black'>
					{descricao}
				</p>
			</NavLink>
		</div>
	);
}
