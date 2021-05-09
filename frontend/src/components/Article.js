import React, { Suspense, useState } from 'react';
import { Link, useParams, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
const ArticleImg = React.lazy(() => import('./ArticleImg'));

const Article = ({
  id,
  title,
  author,
  date,
  description,
  imgURL,
  isAdmin,
  onNewArticle,
  categories,
  accessToken,
}) => {
  const { category } = useParams();
  const { user, isLoading } = useAuth0();
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

  const monthToString = (month) => {
    switch (month) {
      case 1:
        return 'Января';
      case 2:
        return 'Февраля';
      case 3:
        return 'Марта';
      case 4:
        return 'Апреля';
      case 5:
        return 'Мая';
      case 6:
        return 'Июня';
      case 7:
        return 'Июня';
      case 8:
        return 'Августа';
      case 9:
        return 'Сентября';
      case 10:
        return 'Октября';
      case 11:
        return 'Ноября';
      case 12:
        return 'Декабря';
      default:
        return 'Ошибка';
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        'http://localhost:5000/api/categories',
        {
          _id: `${
            categories.find(
              (categ) => categ.title === decodeURIComponent(category)
            )._id
          }`,
          articles: [
            ...categories
              .find((categ) => categ.title === decodeURIComponent(category))
              .articles.filter((article) => article._id !== id),
          ],
          action: 'edit',
          accessToken: `${accessToken}`,
          articleId: `${id}`,
        },
        { headers: { authorization: `Bearer ${accessToken}` } }
      );
      await axios.delete('http://localhost:5000/api/articles', {
        data: {
          _id: `${id}`,
        },
        headers: { authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {
      error(`Ошибка удаления статьи\n${err}`);
      return;
    }

    success('Статья успешно удалена');
    onNewArticle();
  };

  return (
    <Link to={`/category/${category}/article/${id}`} className="article-home">
      {edit && <Redirect to={`/category/${category}/article/${id}/edit`} />}
      {(isAdmin ||
        (!isLoading && user !== undefined && author === user.nickname)) && (
        <AiFillCloseCircle className="delete-btn" onClick={handleClick} />
      )}
      {(isAdmin ||
        (!isLoading && user !== undefined && author === user.nickname)) && (
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
      {date.getDate()} {monthToString(date.getMonth() + 1)} {date.getFullYear()}
      <small className="article-home-author">автор: {author}</small>
      <h2 className="article-home-title">{title}</h2>
      <br />
      {description}
      <br />
    </Link>
  );
};

export default Article;
