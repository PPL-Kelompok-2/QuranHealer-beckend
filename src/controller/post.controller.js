import { Posts } from "../../model/Data.js";

export const postController = {
  async getPost(request, h) {
    const { idPost } = request.params;
    const [result, error] = await Posts.getPost(idPost);
    if (error) {
      return h.response({ error: error.message });
    }
    return h.response({ result }).code(200);
  },
  async post(request, h) {
    const ustadz = request.query.ustadz || null;
    const page = request.query.page || 1;
    const result = await Posts.allPost(page, ustadz, 64);
    return h.response({ result }).code(200);
  },
  async userPost(request, h) {
    const page = request.query.page || 1;
    const result = await Posts.postByUser(page, 64);
    return h.response({ result }).code(200);
  },
};
