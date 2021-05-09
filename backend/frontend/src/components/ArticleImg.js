import { useState, useEffect } from 'react';

function ArticleImg({ imgURL }) {
  const [source, setSource] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = imgURL;
    img.onload = () => setSource(imgURL);
  }, [imgURL]);

  return (
    <div
      style={{
        backgroundImage: `url(${source})`,
      }}
      className="article-home-img"
    ></div>
  );
}

export default ArticleImg;
