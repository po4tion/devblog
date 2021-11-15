import { Main } from '/components/blog';
import { getCategoriesInServer } from '/actions/handleCategory';
import { getTagsInServer } from '/actions/handleTag';
import { ProtectAdminRoute } from '/components/auth';

function Blog({ data }) {
	return (
		<ProtectAdminRoute>
			<Main
				categories={data.categories.data}
				tags={data.tags.data}
				token={data.token}
			/>
		</ProtectAdminRoute>
	);
}

export default Blog;

export async function getServerSideProps(ctx) {
	const categories = await getCategoriesInServer();

	const tags = await getTagsInServer();

	const { req } = ctx;
	const accessToken = req.headers.cookie.slice(13);

	return {
		props: { data: { categories, tags, token: accessToken } },
	};
}
