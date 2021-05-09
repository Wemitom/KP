// import { AiOutlineSearch } from 'react-icons/ai';

function SearchBar({ searchedTitle, handleChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchedTitle}
        minLength="5"
        maxLength="60"
        placeholder="Поиск по названию..."
        onChange={(e) => {
          handleChange(e);
        }}
      />
      {/* <AiOutlineSearch /> */}
    </div>
  );
}

export default SearchBar;
