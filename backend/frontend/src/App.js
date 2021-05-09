import './App.css';
import axios from 'axios';
import Header from './components/Header';
import { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { toast, ToastContainer } from 'react-toastify';
import Articles from './components/Articles';
import ArticlePage from './components/routes/ArticlePage';
import LoginPage from './components/routes/LoginPage';
import NewArticlePage from './components/routes/NewArticlePage';
import 'react-toastify/dist/ReactToastify.min.css';
import NoMatch from './components/routes/NoMatch';
import VerifyEmail from './components/VerifyEmail';
import Categories from './components/Categories';
import CategoryForm from './components/CategoryForm';
import EditArticlePage from './components/routes/EditArticlePage';

function App() {
  const [categories, setCategories] = useState([]);
  const [verifyingOpen, setVerifyingOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [searchedTitle, setSearchedTitle] = useState('');
  const [displayError, setDisplayError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const {
    user,
    isLoading,
    getAccessTokenSilently,
    isAuthenticated,
    loginWithRedirect,
  } = useAuth0();

  async function fetchData() {
    try {
      setFetching(true);
      setCategories(
        (await axios.get('http://localhost:5000/api/categories')).data
      );
      setFetching(false);
    } catch {
      setFetching(false);
      setDisplayError(true);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const error = (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onClose: () => setDisplayError(false),
    });
  };

  useEffect(() => {
    user === undefined
      ? setVerifyingOpen(false)
      : setVerifyingOpen(!user.email_verified);

    const fetchRole = async () => {
      const data = (
        await axios.get(
          `http://localhost:5000/api/role/${
            user !== undefined ? user.sub.toString() : ''
          }`
        )
      ).data;

      setIsAdmin(data.role === 'Admin');
    };

    const fetchToken = async () => {
      try {
        setAccessToken(
          await getAccessTokenSilently({
            audience: `http://localhost:5000/api`,
            scope: 'read:current_user',
          })
        );
      } catch {
        loginWithRedirect();
      }
    };

    if (!isLoading) {
      fetchRole();
      if (isAuthenticated) {
        fetchToken();
      }
    }
  }, [
    user,
    isLoading,
    getAccessTokenSilently,
    isAuthenticated,
    loginWithRedirect,
  ]);

  const onNewArticle = () => {
    fetchData();
  };

  const handleClick = () => {
    setVerifyingOpen(false);
  };

  const handleChange = (e) => {
    setSearchedTitle(e.target.value);
  };

  return (
    <div>
      <ToastContainer />
      <Header
        searchedTitle={searchedTitle}
        handleChange={handleChange}
        isAdmin={isAdmin}
      />
      {verifyingOpen && <VerifyEmail handleClick={handleClick} />}
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => (
            <Categories
              categories={categories}
              searchedTitle={searchedTitle}
              fetching={fetching}
              displayError={displayError}
              error={error}
              onNewArticle={onNewArticle}
              isAdmin={isAdmin}
              accessToken={accessToken}
            />
          )}
        />
        <Route
          path="/login"
          render={() => {
            return <LoginPage />;
          }}
        />
        <Route
          path="/new-article"
          render={(props) => (
            <NewArticlePage
              categories={categories}
              onNewArticle={onNewArticle}
              isAdmin={isAdmin}
              accessToken={accessToken}
            />
          )}
        />
        <Route
          path="/category/:category/article/:id/edit"
          render={(props) => (
            <EditArticlePage
              categories={categories}
              onNewArticle={onNewArticle}
              fetching={fetching}
              isAdmin={isAdmin}
              accessToken={accessToken}
            />
          )}
        />
        <Route
          exact
          path="/category/:category/article/:id"
          render={(props) => (
            <ArticlePage
              categories={categories}
              fetching={fetching}
              isAdmin={isAdmin}
              onNewArticle={onNewArticle}
              accessToken={accessToken}
            />
          )}
        />
        <Route
          path="/category/:category/edit"
          render={(props) => (
            <CategoryForm
              onNewArticle={onNewArticle}
              categories={categories}
              action="put"
            />
          )}
        />
        <Route
          path="/category/:category"
          render={(props) => (
            <Articles
              categories={categories}
              searchedTitle={searchedTitle}
              fetching={fetching}
              isAdmin={isAdmin}
              onNewArticle={onNewArticle}
              accessToken={accessToken}
            />
          )}
        />
        <Route
          path="/new-category"
          render={(props) => (
            <CategoryForm onNewArticle={onNewArticle} action="post" />
          )}
        />
        <Route component={NoMatch} />
      </Switch>
    </div>
  );
}

export default App;
