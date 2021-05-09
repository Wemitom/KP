function Comment({ comment }) {
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

  return (
    <div className="article-comment">
      <small>
        {comment.author}
        <span style={{ float: 'right' }}>
          {calculateTimePosted(comment.date) + ' назад'}
        </span>{' '}
      </small>
      <p style={{ marginTop: '10px' }}>{comment.body}</p>
    </div>
  );
}

export default Comment;
