import { useEffect } from 'react';
import Category from './Category';
import Loader from 'react-loader-spinner';

function Categories({
  categories,
  searchedTitle,
  fetching,
  displayError,
  error,
  accessToken,
  isAdmin,
  onNewArticle,
}) {
  useEffect(() => {
    if (displayError) {
      error('Ошибка при подключении к базе данных');
    }
  }, [error, displayError]);

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().startsWith(searchedTitle.toLowerCase())
  );

  return (
    <div className="articles">
      {filteredCategories.length !== 0
        ? filteredCategories.map((category) => (
            <Category
              key={category._id}
              id={category._id}
              title={category.title}
              description={category.description}
              imgURL={category.imgURL}
              accessToken={accessToken}
              isAdmin={isAdmin}
              onNewArticle={onNewArticle}
            />
          ))
        : !fetching && <h1>Категорий не найдено</h1>}
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

export default Categories;
