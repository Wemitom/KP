import { useState } from 'react';
import { createBrowserHistory } from 'history';
import { useLocation } from 'react-router-dom';

function ArticleForm({
  categories,
  initTitle = 'Новая статья',
  initDescription = '',
  initImgURL = '',
  initCategory = categories.length !== 0 ? categories[0].title : '',
}) {
  const [title, setTitle] = useState(initTitle);
  const [description, setDescription] = useState(initDescription);
  const [imgURL, setImgURL] = useState(initImgURL);
  const [category, setCategory] = useState(initCategory);

  const history = createBrowserHistory();
  const location = useLocation();

  let textAreaStyle;
  const errorStyle = { borderColor: 'red', backgroundColor: '#ffcccb' };
  const successStyle = { borderColor: 'green', backgroundColor: 'lightgreen' };

  return (
    <form
      className="new-article-form"
      onSubmit={() => {
        history.push(
          `${location.pathname}/title=${encodeURIComponent(
            title
          )}/description=${encodeURIComponent(
            description
          )}/imgURL=${encodeURIComponent(imgURL)}/category=${encodeURIComponent(
            category
          )}`
        );
      }}
    >
      Введите название статьи:
      <input
        type="text"
        placeholder="Введите название(5-60 символов)"
        style={{ borderRadius: '5px' }}
        defaultValue={initTitle}
        required
        minLength="5"
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
      {categories.length !== 0 && (
        <span style={{ marginTop: '10px' }}>Выберите категорию:</span>
      )}
      {categories.length !== 0 && (
        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((categ) => (
            <option key={categ._id} value={categ.title}>
              {categ.title}
            </option>
          ))}
        </select>
      )}
      <input
        type="submit"
        value="Далее"
        className="btn"
        style={{ marginTop: '20px' }}
      />
    </form>
  );
}

export default ArticleForm;
