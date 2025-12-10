import { STRAPI_BASE_URL } from '@/api/Strapi';
import { usePost } from '@/hooks/usePost';
import {
	FaChevronLeft,
	FaClock,
	FaMapMarkerAlt,
	FaWhatsapp,
} from 'react-icons/fa';
import { NavLink, useParams } from 'react-router';
import Pointer from '../../../components/atoms/geo/Pointer';

export default function PostDetails() {
	const { itemId } = useParams<{ itemId: string }>();
	const { post } = usePost(itemId ?? '');

	if (!itemId) return <p>Item não encontrado</p>;
	console.log('Post:', post);
	return (
		<div className='flex flex-col'>
			<div className='mt-2 mb-4 flex self-start'>
				<NavLink to='/'>
					<FaChevronLeft size={32} />
				</NavLink>
			</div>
			<div
				className='relative mx-auto w-full max-w-md overflow-hidden rounded-2xl shadow-lg'
				style={{
					backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.16) 0%, rgba(0, 0, 0, 0.432) 53.15%, rgba(0, 0, 0, 0.664) 68.84%, rgba(0, 0, 0, 0.8) 85.75%), url(${STRAPI_BASE_URL}${post?.imagem[0]?.url})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				<div className='flex h-72 items-end'>
					<h3 className='w-full bg-linear-to-t from-black/70 to-transparent px-4 py-2 text-center text-lg font-bold text-white md:text-2xl'>
						{post?.titulo}
					</h3>
				</div>
			</div>
			<h1 className='mt-2 text-xl font-bold'>Descrição</h1>
			<p className='mt-2 mb-4 text-justify'>{post?.descricao}</p>
			<div className='flex flex-col gap-2'>
				<div className='flex items-center gap-4'>
					<FaClock
						color='#2C3E50'
						size={21}
					/>
					<span>{post?.horario?.toLocaleString()}</span>
				</div>
				<div className='flex items-center gap-4'>
					<FaMapMarkerAlt
						color='#2C3E50'
						size={21}
					/>
					<span>{post?.endereco}</span>
				</div>
				<div className='flex items-center justify-between gap-4'>
					<div className='flex items-center gap-2'>
						<FaWhatsapp
							color='#2C3E50'
							size={21}
						/>
						<span>{post?.contato}</span>
					</div>
					<Pointer
						lat={post?.local.lat}
						lng={post?.local.lng}
					/>
				</div>
			</div>
		</div>
	);
}
