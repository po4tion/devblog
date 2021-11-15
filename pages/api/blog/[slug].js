/* 
  1. 해당 블로그의 정보를 가져온다
	2. 해당 블로그를 정보를 제거한다
  3. 해당 블로그를 업데이트 한다
*/

import Blog from '/models/Blog';
import {
	dbConnect,
	adminMiddleware,
	tokenValidation,
	excerptHandler,
} from '/lib';
import formidable from 'formidable';
import _ from 'lodash';
import { stripHtml } from 'string-strip-html';
import fs from 'fs';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default function handler(req, res) {
	return new Promise(async () => {
		const { method } = req;

		await dbConnect();

		switch (method) {
			case 'GET':
				try {
					const { slug } = req.query;

					await Blog.findOne({ slug: slug.toLowerCase() })
						.populate('categories', '_id name slug')
						.populate('tags', '_id name slug')
						.populate('postedBy', '_id username name')
						.select(
							'categories tags _id title slug body sTitle sDesc postedBy createdAt updatedAt'
						)
						.exec((err, data) => {
							if (err) {
								return res.status(400).json({
									error: '해당 블로그를 불러오지 못했습니다.',
								});
							}

							return res.status(200).json({ data });
						});
				} catch (error) {
					return res.status(400).json({ error: '에러' });
				}
				break;
			case 'DELETE':
				try {
					// 토큰 유효성 검사
					const user = await tokenValidation(req, res).catch(msg =>
						res.status(400).json({ error: 'getTokenError' })
					);

					// 유효성 검사를 통과하고 받은 데이터 전송 후, 프로필 값 반환
					const auth = await adminMiddleware(req, res, user);

					req.profile.password = undefined;

					if (auth) {
						const { slug } = req.query;

						await Blog.findOneAndRemove({ slug: slug.toLowerCase() }).exec(
							(err, data) => {
								if (err) {
									return res.status(400).json({
										error: '해당 블로그 삭제를 실패했습니다',
									});
								}

								return res
									.status(200)
									.json({ success: '해당 블로그를 삭제했습니다.' });
							}
						);
					}
				} catch (error) {
					return res.status(400).json({ error: '에러' });
				}
				break;
			case 'PUT':
				try {
					// 토큰 유효성 검사
					const user = await tokenValidation(req, res).catch(msg =>
						res.status(400).json({ error: 'getTokenError' })
					);

					// 유효성 검사를 통과하고 받은 데이터 전송 후, 프로필 값 반환
					const auth = await adminMiddleware(req, res, user);

					req.profile.password = undefined;

					if (auth) {
						const { slug } = req.query;

						await Blog.findOne({ slug: slug.toLowerCase() }).exec(
							(err, prev) => {
								if (err) {
									return res.status(400).json({
										error: '블로그를 찾을 수 없습니다',
									});
								}

								const form = new formidable.IncomingForm({
									keepExtensions: true,
								});

								form.parse(req, async (err, fields, files) => {
									if (err) {
										return res
											.status(400)
											.json({ error: '사진을 업로드 할 수 없습니다' });
									}

									// slug는 unique 속성을 갖고 있다(까먹지 말기)
									const prevSlug = prev.slug;
									prev = _.merge(prev, fields);
									// prev.slug = prevSlug;

									const { body, desc, categories: ctg, tags: tg } = fields;

									// 본문 업데이트
									if (body) {
										prev.excerpt = excerptHandler(body, 300, ' ', ' ...');
										prev.sDesc = stripHtml(body.substring(0, 150)).result;
									}

									// 카테고리 업데이트
									if (ctg) {
										prev.categories = ctg.split(',');
									}

									// 태그 업데이트
									if (tg) {
										prev.tags = tg.split(',');
									}

									// 사진 업데이트
									if (files.photo) {
										if (files.photo.size >= 1500000) {
											return res.status(400).json({
												error: '사진은 1mb를 넘을 수 없습니다.',
											});
										}

										prev.photo.data = fs.readFileSync(files.photo.filepath);
										prev.photo.contentType = files.photo.mimetype;
									}

									// 업데이트 저장
									await prev.save((err, data) => {
										if (err) {
											return res.status(400).json({
												error: '업데이트 저장 실패',
											});
										}

										return res.status(200).json({ data });
									});
								});
							}
						);
					}
				} catch (error) {
					return res.status(400).json({ error: '에러' });
				}
				break;
			default:
				return res.status(400).json({ error: 'request method를 확인해주세요' });
				break;
		}
	});
}
