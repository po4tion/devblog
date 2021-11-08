import axios from 'axios';

export const createBlog = async (blog, token) => {
	const result = await axios
		.post('/api/blog', blog, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		.then(res => res.data)
		.catch(err => err.response.data);

	return result;
};

export const getBlog = async slug => {
	const result = await axios
		.get(`/api/blog/${slug}`)
		.then(res => res.data)
		.catch(err => err.response.data);

	return result;
};

export const getBlogs = async () => {
	const result = await axios
		.get('/api/blogs')
		.then(res => res.data)
		.catch(err => err.response.data);

	return result;
};

export const removeBlog = async (slug, token) => {
	const result = await axios
		.delete(`/api/blog/${slug}`, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		.then(res => res.data)
		.catch(err => err.response.data);

	return result;
};

export const updateBlog = async (blog, slug, token) => {
	const result = await axios
		.put(`/api/blog/${slug}`, blog, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		.then(res => res.data)
		.catch(err => err.response.data);

	return result;
};