import { Route, useRouteMatch, useParams } from 'react-router-dom';
import EditorPage from './EditorPage';
import ArticleForm from '../ArticleForm';
import NoMatch from './NoMatch';
import { withAuthenticationRequired, useAuth0 } from '@auth0/auth0-react';

function EditArticlePage({
  categories,
  onNewArticle,
  fetching,
  isAdmin,
  accessToken,
}) {
  let { path } = useRouteMatch();
  const { category, id } = useParams();
  const { user } = useAuth0();

  const currentCategory =
    categories.length === 0
      ? []
      : categories.find(
          (categ) => categ.title === decodeURIComponent(category)
        );

  const currentArticle =
    currentCategory === undefined
      ? { title: '', description: '', category: '', imgURL: '' }
      : currentCategory.articles.find((article) => article._id === id);

  return (
    <>
      {currentArticle.title === '' ||
      user === undefined ||
      (user.nickname !== currentArticle.author && !isAdmin) ? (
        !fetching && <NoMatch />
      ) : (
        <>
          <Route
            exact
            path={`${path}`}
            render={(props) => (
              <ArticleForm
                categories={categories}
                initTitle={currentArticle.title}
                initDescription={currentArticle.description}
                initCategory={decodeURIComponent(category)}
                initImgURL={currentArticle.imgURL}
              />
            )}
          />
          <Route
            path={`${path}/title=:title/description=:description/imgURL=:imgURL/category=:categor`}
            render={(props) => (
              <EditorPage
                categories={categories}
                initValue={currentArticle.body}
                onNewArticle={onNewArticle}
                method="put"
                isAdmin={isAdmin}
                accessToken={accessToken}
              />
            )}
          />
        </>
      )}
    </>
  );
}

export default withAuthenticationRequired(EditArticlePage);
