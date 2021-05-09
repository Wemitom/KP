import { Route, useRouteMatch } from 'react-router-dom';
import EditorPage from './EditorPage';
import ArticleForm from '../ArticleForm';
import { withAuthenticationRequired } from '@auth0/auth0-react';

function NewArticlePage({ categories, onNewArticle, isAdmin, accessToken }) {
  let { path } = useRouteMatch();

  return (
    <>
      <Route
        exact
        path={`${path}`}
        render={(props) => <ArticleForm categories={categories} />}
      />
      <Route
        path={`${path}/title=:title/description=:description/imgURL=:imgURL/category=:categor`}
        render={(props) => (
          <EditorPage
            categories={categories}
            initValue="Новая статья"
            onNewArticle={onNewArticle}
            method="post"
            isAdmin={isAdmin}
            accessToken={accessToken}
          />
        )}
      />
    </>
  );
}

export default withAuthenticationRequired(NewArticlePage);
