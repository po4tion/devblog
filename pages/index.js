/* 
	홈 페이지
*/

import { HomeList } from '/components/home';
import { getBlogsInServer } from '/actions/handleBlog';
import { getTagList } from '/actions/handleTag';
import Head from 'next/head';

function Home() {
	return <HomeList />;
}

export default Home;
