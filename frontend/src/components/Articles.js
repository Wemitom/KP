import { useEffect } from 'react';
import { useParams } from 'react-router';
import Article from './Article';
import Loader from 'react-loader-spinner';

function Articles({
  categories,
  searchedTitle,
  fetching,
  displayError,
  error,
  isAdmin,
  onNewArticle,
  accessToken,
}) {
  const { category } = useParams();

  useEffect(() => {
    if (displayError) {
      error('Ошибка при подключении к базе данных');
    }
  }, [error, displayError]);

  const categoryArticles =
    categories.length === 0
      ? []
      : categories.find(
          (categ) => categ.title === decodeURIComponent(category)
        );

  const filteredArticles =
    categoryArticles === undefined || categoryArticles.length === 0
      ? []
      : categoryArticles.articles.filter((article) =>
          article.title.toLowerCase().startsWith(searchedTitle.toLowerCase())
        );

  return (
    <div className={'articles'}>
      {filteredArticles.length !== 0
        ? filteredArticles.map((article) => (
            <Article
              key={article._id}
              id={article._id}
              title={article.title}
              date={new Date(article.date)}
              description={article.description}
              author={article.author}
              imgURL={article.imgURL}
              isAdmin={isAdmin}
              onNewArticle={onNewArticle}
              categories={categories}
              accessToken={accessToken}
            />
          ))
        : !fetching && (
            <h1 style={{ color: 'rgb(175,0,0)' }}>Статей не найдено</h1>
          )}
      {fetching && (
        <Loader
          type="TailSpin"
          color="rgb(175,0,0)"
          height={100}
          width={100}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'absolute',
            zIndex: '2',
          }}
        />
      )}
    </div>
  );
}

export default Articles;
