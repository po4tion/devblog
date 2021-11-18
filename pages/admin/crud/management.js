import { getBlogsInServer } from '/actions/handleBlog';
import { ManagementBlog } from '/components/blog';
import { ProtectAdminRoute } from '/components/auth';

function Management({ blogList, token, size }) {
	return (
		<ProtectAdminRoute>
			<ManagementBlog blogList={blogList} token={token} size={size} />
		</ProtectAdminRoute>
	);
}

export default Management;

export async function getServerSideProps(ctx) {
	const { req } = ctx;
	const accessToken = req.headers.cookie.slice(13);
	const blogList = await getBlogsInServer();

	return {
		props: {
			blogList,
			token: accessToken,
			size: blogList.data.length,
		},
	};
}
