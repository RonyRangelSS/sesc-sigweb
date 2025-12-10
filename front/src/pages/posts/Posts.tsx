import { usePosts } from '@/hooks/usePost';
import { NavLink } from 'react-router';

export default function PostsList() {
	const { posts, isLoading } = usePosts();

	if (isLoading) return <p className='mt-8 text-center'>Carregando...</p>;
	if (!posts.length)
		return <p className='mt-8 text-center'>Nenhum post encontrado.</p>;

	return (
		<div className='mx-auto max-w-3xl px-4 py-8'>
			<h1 className='mb-6 text-center text-2xl font-bold'>Todos os Posts</h1>
			<div className='grid gap-6 md:grid-cols-2'>
				{posts.map((post) => (
					<NavLink
						to={`/posts/${post.id}`}
						key={post.id}
						className='block cursor-pointer transition-shadow duration-200 hover:shadow-lg'
					>
						<div
							className='relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl shadow-md'
							style={{
								backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.432) 53.15%, rgba(0,0,0,0.664) 68.84%, rgba(0,0,0,0.8) 85.75%), url(${post.imagem?.[0]?.url})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
						>
							<h3 className='bg-gradient-to-t from-black/70 to-transparent px-4 py-2 text-lg font-bold text-white'>
								{post.titulo}
							</h3>
						</div>
						<div className='p-4'>
							<p className='line-clamp-2 text-sm text-gray-700'>
								{post.descricao}
							</p>
							<div className='mt-2 flex items-center gap-2 text-xs text-gray-500'>
								<span>{post.horario?.toLocaleString?.()}</span>
								<span>•</span>
								<span>{post.endereco}</span>
							</div>
						</div>
					</NavLink>
				))}
			</div>
		</div>
	);
}
