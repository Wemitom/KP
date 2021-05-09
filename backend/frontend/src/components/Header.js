import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';
import SearchBar from './SearchBar';
import { useLocation } from 'react-router-dom';

function Header({ searchedTitle, handleChange, isAdmin }) {
  let location = useLocation();

  return (
    <header className="page-header">
      <ul className="nav">
        <li>
          <Link to="/" className="grid-item">
            Домой
          </Link>
        </li>
        <li>
          <Link to="/new-article"> Новая статья </Link>
        </li>
        {isAdmin && (
          <li>
            <Link to="/new-category"> Новая категория </Link>
          </li>
        )}
        <li style={{ float: 'right', marginRight: '50px' }}>
          <AuthButton />
        </li>
        {(location.pathname === '/' ||
          location.pathname.match(/\/category\/.+$/) !== null) && (
          <li>
            <SearchBar
              searchedTitle={searchedTitle}
              handleChange={handleChange}
            />
          </li>
        )}
      </ul>
    </header>
  );
}

export default Header;
