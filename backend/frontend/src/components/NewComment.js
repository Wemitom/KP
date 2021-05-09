import { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function NewComment({ comments, onNewComment, accessToken }) {
  const { user, isAuthenticated } = useAuth0();
  const { id } = useParams();
  const [body, setBody] = useState('');
  const [redirectLogin, setRedirectLogin] = useState(false);

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
    if (!isAuthenticated) {
      setRedirectLogin(true);
    } else {
      try {
        await axios.put(
          'http://localhost:5000/api/articles/comments',
          {
            _id: `${id}`,
            comments: [
              ...comments,
              {
                body: `${body}`,
                date: `${Date.now()}`,
                author: `${user.nickname}`,
              },
            ],
          },
          { headers: { authorization: `Bearer ${accessToken}` } }
        );
      } catch (err) {
        error(err + ' Ошибка добавления комментария...');
        return;
      }
      onNewComment(body, user.nickname);
      success(`Комментарий успешно добавлен`);
      setBody('');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {redirectLogin && <Redirect to="/login" />}
      <textarea
        style={{
          width: '100% ',
          height: '10vh',
          borderRadius: '5px',
          resize: 'none',
        }}
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
        }}
      />
      <button className="btn" style={{ width: '40vw' }} onClick={handleClick}>
        Выложить
      </button>
    </div>
  );
}

export default NewComment;
