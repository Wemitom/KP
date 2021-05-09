import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import ReactHtmlParser from 'react-html-parser';
import Loader from 'react-loader-spinner';
import NoMatch from './NoMatch';
import Prism from 'prismjs';
import '../../prism.css';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-java';
import Comments from '../Comments';
import { useAuth0 } from '@auth0/auth0-react';
import NewComment from '../NewComment';
import mongoose from 'mongoose';
import axios from 'axios';

function ArticlePage({
  categories,
  fetching,
  onNewArticle,
  isAdmin,
  accessToken,
}) {
  let { category, id } = useParams();
  const [comments, setComments] = useState([]);

  const { user, isLoading } = useAuth0(0);

  let location = useLocation();

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

  const currCategory = useMemo(
    () =>
      categories.length === 0
        ? { comments: [] }
        : categories.find(
            (categ) => categ.title === decodeURIComponent(category)
          ),
    [categories, category]
  );

  const article =
    currCategory === undefined || currCategory.articles === undefined
      ? undefined
      : currCategory.articles.find((article) => article._id === id);

  const calculateTimePosted = (date) => {
    const datePosted = new Date(date);
    const timePassedMs = Math.abs(datePosted.getTime() - Date.now());

    if (Math.floor(timePassedMs / (3.154 * Math.pow(10, 10))) === 0) {
      if (Math.floor(timePassedMs / (2.628 * Math.pow(10, 9))) === 0) {
        if (Math.floor(timePassedMs / (8.64 * Math.pow(10, 7))) === 0) {
          if (Math.floor(timePassedMs / (3.6 * Math.pow(10, 6))) === 0) {
            if (Math.floor(timePassedMs / 60000) === 0) {
              if (Math.round(timePassedMs / 1000) === 1) {
                return `${Math.round(timePassedMs / 1000)} секунду`;
              } else if (
                Math.round(timePassedMs / 1000) >= 2 &&
                Math.round(timePassedMs / 1000) <= 4
              ) {
                return `${Math.round(timePassedMs / 1000)} секунды`;
              } else {
                return `${Math.round(timePassedMs / 1000)} секунд`;
              }
            } else if (Math.floor(timePassedMs / 60000) === 1) {
              return `${Math.floor(timePassedMs / 60000)} минуту`;
            } else if (
              Math.floor(timePassedMs / 60000) >= 2 &&
              Math.floor(timePassedMs / 60000) <= 4
            ) {
              return `${Math.floor(timePassedMs / 60000)} минуты`;
            } else {
              return `${Math.floor(timePassedMs / 60000)} минут`;
            }
          } else if (Math.floor(timePassedMs / (3.6 * Math.pow(10, 6))) === 1) {
            return `${Math.floor(timePassedMs / (3.6 * Math.pow(10, 6)))} час`;
          } else if (
            Math.floor(timePassedMs / (3.6 * Math.pow(10, 6))) >= 2 &&
            Math.floor(timePassedMs / (3.6 * Math.pow(10, 6))) <= 4
          ) {
            return `${Math.floor(timePassedMs / (3.6 * Math.pow(10, 6)))} часа`;
          } else {
            return `${Math.floor(
              timePassedMs / (3.6 * Math.pow(10, 6))
            )} часов`;
          }
        } else if (Math.floor(timePassedMs / (8.64 * Math.pow(10, 7))) === 1) {
          return `${Math.floor(timePassedMs / (8.64 * Math.pow(10, 7)))} день`;
        } else if (
          Math.floor(timePassedMs / (8.64 * Math.pow(10, 7))) >= 2 &&
          Math.floor(timePassedMs / (8.64 * Math.pow(10, 7))) <= 4
        ) {
          return `${Math.floor(timePassedMs / (8.64 * Math.pow(10, 7)))} дня`;
        } else {
          return `${Math.floor(timePassedMs / (8.64 * Math.pow(10, 7)))} дней`;
        }
      } else if (Math.floor(timePassedMs / (2.628 * Math.pow(10, 9))) === 1) {
        return `${Math.floor(timePassedMs / (2.628 * Math.pow(10, 9)))} месяц`;
      } else if (
        Math.floor(timePassedMs / (2.628 * Math.pow(10, 9))) >= 2 &&
        Math.floor(timePassedMs / (2.628 * Math.pow(10, 9))) <= 4
      ) {
        return `${Math.floor(timePassedMs / (2.628 * Math.pow(10, 9)))} месяца`;
      } else {
        return `${Math.floor(
          timePassedMs / (2.628 * Math.pow(10, 9))
        )} месяцов`;
      }
    } else if (Math.floor(timePassedMs / (3.154 * Math.pow(10, 10))) === 1) {
      return `${Math.floor(timePassedMs / (3.154 * Math.pow(10, 10)))} год`;
    } else if (
      Math.floor(timePassedMs / (3.154 * Math.pow(10, 10))) >= 2 &&
      Math.floor(timePassedMs / (3.154 * Math.pow(10, 10))) <= 4
    ) {
      return `${Math.floor(timePassedMs / (3.154 * Math.pow(10, 10)))} года`;
    } else {
      return `${Math.floor(timePassedMs / (3.154 * Math.pow(10, 10)))} лет`;
    }
  };

  const handleClick = async () => {
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

  useEffect(() => {
    Prism.highlightAll();
  });

  useEffect(() => {
    if (article !== undefined) {
      setComments(article.comments);
    }
  }, [fetching, article]);

  const onNewComment = (body, nickname) => {
    setComments([
      ...comments,
      {
        _id: mongoose.Types.ObjectId(),
        body: `${body}`,
        date: `${new Date(Date.now())}`,
        author: `${nickname}`,
      },
    ]);
  };

  return (
    <div>
      {article === undefined || article.body === undefined ? (
        (!fetching && <NoMatch />) ||
        (fetching && (
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
        ))
      ) : (
        <div className="article ">
          <h1 className="article-title">{article.title}</h1> <br /> <br />
          <p>{article.description}</p>
          <small>
            выложено {calculateTimePosted(article.date)} назад автор{' '}
            {article.author}
          </small>
          {(isAdmin ||
            (!isLoading &&
              user !== undefined &&
              article.author === user.nickname)) && (
            <Link to={`${location.pathname}/edit`} className="edit-btn">
              Редактировать
              <AiFillEdit />
            </Link>
          )}
          {(isAdmin ||
            (!isLoading &&
              user !== undefined &&
              article.author === user.nickname)) && (
            <Link
              to={`..`}
              className="edit-btn"
              style={{ marginRight: '10px' }}
              onClick={handleClick}
            >
              Удалить
              <BsFillTrashFill />
            </Link>
          )}
          <div className="article-body">{ReactHtmlParser(article.body)}</div>
          <h1>Комменатрии:</h1>
          <NewComment
            comments={comments}
            onNewComment={onNewComment}
            accessToken={accessToken}
          />
          {comments.length > 0 && <Comments comments={comments} />}
        </div>
      )}
    </div>
  );
}

export default ArticlePage;
