import { useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth0 } from '@auth0/auth0-react';
import Loader from 'react-loader-spinner';
import axios from 'axios';

function CategoryForm({ onNewArticle, categories, action }) {
  const { category } = useParams();
  const categor =
    category === undefined
      ? null
      : categories.find(
          (categ) => categ.title === decodeURIComponent(category)
        );

  const [title, setTitle] = useState(
    categor === null ? 'Новая статья' : categor.title
  );
  const [description, setDescription] = useState(
    categor === null ? '' : categor.description
  );
  const [imgURL, setImgURL] = useState(categor === null ? '' : categor.imgURL);
  const [returnHome, setReturnHome] = useState(false);
  const [posting, setPosting] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  let textAreaStyle;
  const errorStyle = { borderColor: 'red', backgroundColor: '#ffcccb' };
  const successStyle = { borderColor: 'green', backgroundColor: 'lightgreen' };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCategory = {
      title: `${title}`,
      description: `${description}`,
      imgURL: `${imgURL}`,
    };

    try {
      setPosting(true);
      const accessToken = await getAccessTokenSilently({
        audience: `http://localhost:5000/api`,
        scope: 'read:current_user',
      });

      if (action === 'post') {
        await axios.post(
          'http://localhost:5000/api/categories',
          { ...newCategory, articles: [] },
          {
            headers: { authorization: `Bearer ${accessToken}` },
          }
        );
      } else if (action === 'put') {
        await axios.put(
          'http://localhost:5000/api/category',
          {
            ...newCategory,
            oldTitle: `${category}`,
            articles: categor.articles,
          },
          {
            headers: { authorization: `Bearer ${accessToken}` },
          }
        );
      }
      setPosting(false);
    } catch (err) {
      error(
        err +
          ' Ошибка добавления категории в базу данных. Возвращение на домашюю страницу...'
      );
      setReturnHome(true);
      return;
    }
    onNewArticle();
    success(`Категория '${decodeURIComponent(title)}' успешно загружена`);
    setReturnHome(true);
  };

  return (
    <form className="new-article-form" onSubmit={handleSubmit}>
      {returnHome && (
        <Redirect to={{ pathname: '/', state: { errorConnecting: false } }} />
      )}
      {posting && (
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
      Введите название категории:
      <input
        type="text"
        placeholder="Введите название(1-60 символов)"
        style={{ borderRadius: '5px' }}
        defaultValue={categor === null ? 'Новая статья' : categor.title}
        required
        minLength="1"
        maxLength="60"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <span style={{ marginTop: '10px' }}>Введите описание:</span>
      <textarea
        placeholder="Введите описание(1-70 символов)"
        required
        maxLength="70"
        value={description}
        style={textAreaStyle}
        onChange={(e) => {
          setDescription(e.target.value);
          if (e.target.value.length < 5 || e.target.value > 60) {
            textAreaStyle = errorStyle;
          } else {
            textAreaStyle = successStyle;
          }
        }}
      />
      <span style={{ marginTop: '10px' }}>
        Введите URL картинки для заднего фона:
      </span>
      <input
        type="text"
        placeholder="Введите URL"
        style={{ borderRadius: '5px' }}
        value={imgURL}
        required
        pattern=".+\.(jpeg|jpg|gif|png)$"
        onChange={(e) => {
          setImgURL(e.target.value);
        }}
      />
      <input
        type="submit"
        value="Создать"
        className="btn"
        style={{ marginTop: '20px' }}
      />
    </form>
  );
}

export default CategoryForm;
