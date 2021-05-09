import { Editor } from '@tinymce/tinymce-react';
import { useState } from 'react';
import Loader from 'react-loader-spinner';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import mongoose from 'mongoose';

function EditorPage({
  categories,
  initValue,
  onNewArticle,
  method,
  accessToken,
}) {
  const [body, setBody] = useState(initValue);
  const [returnHome, setReturnHome] = useState(false);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);

  let { title, description, imgURL, categor, category, id } = useParams();
  description === undefined && (description = null);
  imgURL === undefined && (imgURL = null);

  const articleId = mongoose.Types.ObjectId();

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

  const handleClick = async () => {
    const newArticle = {
      title: `${decodeURIComponent(title)}`,
      description: `${decodeURIComponent(description)}`,
      body: `${body}`,
      date: `${Date.now()}`,
      imgURL: `${imgURL}`,
      hidden: 'false',
    };

    try {
      setPosting(true);
      if (
        categories.find(
          (categ) => categ.title === decodeURIComponent(categor)
        ) === undefined
      ) {
        throw Error('Неверное значение категории');
      }

      if (method === 'post') {
        await axios.post(
          'http://localhost:5000/api/articles',
          {
            ...newArticle,
            _id: `${articleId}`,
            accessToken: `${accessToken}`,
            comments: [],
          },
          { headers: { authorization: `Bearer ${accessToken}` } }
        );
        await axios.put(
          'http://localhost:5000/api/categories',
          {
            _id: `${
              categories.find(
                (categ) => categ.title === decodeURIComponent(categor)
              )._id
            }`,
            articles: [
              ...categories.find(
                (categ) => categ.title === decodeURIComponent(categor)
              ).articles,
              `${articleId}`,
            ],
          },
          { headers: { authorization: `Bearer ${accessToken}` } }
        );
      } else if (method === 'put') {
        await axios.put(
          'http://localhost:5000/api/articles',
          {
            ...newArticle,
            _id: `${id}`,
          },
          { headers: { authorization: `Bearer ${accessToken}` } }
        );
        if (category !== categor) {
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
              articleId: `${id}`,
              action: 'edit',
            },
            { headers: { authorization: `Bearer ${accessToken}` } }
          );
          await axios.put(
            'http://localhost:5000/api/categories',
            {
              _id: `${
                categories.find(
                  (categ) => categ.title === decodeURIComponent(categor)
                )._id
              }`,
              articles: [
                ...categories.find(
                  (categ) => categ.title === decodeURIComponent(categor)
                ).articles,
                `${id}`,
              ],
            },
            { headers: { authorization: `Bearer ${accessToken}` } }
          );
        }
      }
      setPosting(false);
    } catch (err) {
      error(
        err +
          ' Ошибка добавления статьи в базу данных. Возвращение на домашюю страницу...'
      );
      setReturnHome(true);
      return;
    }
    onNewArticle();
    success(`Статья '${decodeURIComponent(title)}' успешно загружена`);
    setReturnHome(true);
  };

  return (
    <div className="editor">
      <ToastContainer />
      {(loading || posting) && (
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
      {returnHome && (
        <Redirect to={{ pathname: '/', state: { errorConnecting: false } }} />
      )}
      <Editor
        initialValue={body}
        apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
        init={{
          height: '88vh',
          width: '71vw',
          content_style: 'body {color: rgb(175, 0, 0);}',
          setMode: 'readonly',
          language: 'ru',
          menubar: 'insert | edit | format | view',
          plugins:
            'advlist autolink lists link image charmap print preview anchor ' +
            'searchreplace visualblocks code fullscreen ' +
            'insertdatetime media table paste code help wordcount toc codesample',
          toolbar:
            'undo redo | formatselect | bold italic backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat | help | codesample code | toc',
        }}
        onEditorChange={(content) => setBody(content)}
        onInit={() => {
          setLoading(false);
        }}
      />
      <button
        className={`btn ${loading ? 'hidden' : ''}`}
        onClick={handleClick}
      >
        Выложить
      </button>
    </div>
  );
}

export default EditorPage;
