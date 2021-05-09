import React, { Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
const ArticleImg = React.lazy(() => import('./ArticleImg'));

const Category = ({
  title,
  description,
  imgURL,
  onNewArticle,
  isAdmin,
  accessToken,
}) => {
  const [edit, setEdit] = useState(false);

  const success = (message) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const error = (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.delete('http://localhost:5000/api/categories', {
        data: { title: `${title}` },
        headers: { authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {
      error(`Ошибка удаления категории\n${err}`);
      return;
    }

    success('Категория успешно удалена');
    onNewArticle();
  };

  return (
    <Link
      to={`/category/${encodeURIComponent(title)}`}
      className="article-home"
    >
      {edit && <Redirect to={`/category/${encodeURIComponent(title)}/edit`} />}
      {isAdmin && (
        <AiFillCloseCircle className="delete-btn" onClick={handleClick} />
      )}
      {isAdmin && (
        <AiFillEdit
          className="edit-btn-article"
          onClick={(e) => {
            e.preventDefault();
            setEdit(true);
          }}
        />
      )}
      <Suspense fallback={<div className="img-fallback">Загрузка...</div>}>
        <ArticleImg imgURL={imgURL} />
      </Suspense>
      <h2 className="article-home-title">{title}</h2>
      <br />
      {description}
      <br />
    </Link>
  );
};

export default Category;
