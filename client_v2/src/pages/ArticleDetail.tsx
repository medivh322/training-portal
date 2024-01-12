import { Layout, Typography } from "antd";
import { useParams } from "react-router-dom";
import { articlesApiHooks } from "../redux/articles/reducer";

const ArticleDetail = () => {
  const { articleId } = useParams();
  const { data: articleData } = articlesApiHooks.useGetArticleQuery(
    { articleId },
    { skip: !articleId }
  );

  return (
    <Layout>
      {articleData && (
        <>
          <Typography.Title>{articleData?.name}</Typography.Title>
          <div dangerouslySetInnerHTML={{ __html: articleData?.text }}></div>
        </>
      )}
    </Layout>
  );
};

export default ArticleDetail;
