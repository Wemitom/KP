import Comment from './Comment';

function Comments({ comments }) {
  const reversedComments = [...comments];

  return (
    <div className="comments">
      {reversedComments
        .reverse()
        .filter((comment) => comment.body !== undefined)
        .map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
    </div>
  );
}

export default Comments;
