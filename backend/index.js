const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const ArticleModel = require('./models/Article.js');
const path = require('path');
const CategoryModel = require('./models/Category');
const axios = require('axios').default;
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwks = require('jwks-rsa');

const app = express();

const PORT = process.env.PORT || 5000;

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: `http://localhost:${PORT}/api`,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/api/articles', async (req, res) => {
  try {
    const articles = await ArticleModel.find().sort({ date: -1 });
    res.status(200).json(articles);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const author = await ArticleModel.find({ _id: req.params.id }).author;
    res.json(author);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.post('/api/articles', async (req, res) => {
  try {
    const user = (
      await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
        headers: { authorization: `${req.headers.authorization}` },
      })
    ).data;

    const article = new ArticleModel({
      _id: req.body._id,
      title: req.body.title,
      author: user.nickname,
      body: req.body.body,
      description: req.body.description,
      comments: req.body.comments,
      imgURL: decodeURIComponent(req.body.imgURL),
      hidden: req.body.hidden,
    });

    const savedArticle = await article.save();
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
});

app.put('/api/articles', jwtCheck, async (req, res) => {
  try {
    const savedArticle = await ArticleModel.updateOne(
      { _id: req.body._id },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          body: req.body.body,
          imgURL: decodeURIComponent(req.body.imgURL),
        },
      }
    );
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.put('/api/articles/comments', jwtCheck, async (req, res) => {
  try {
    const savedArticle = await ArticleModel.updateOne(
      { _id: req.body._id },
      {
        $set: {
          comments: req.body.comments,
        },
      }
    );
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.delete('/api/articles', jwtCheck, async (req, res) => {
  try {
    await ArticleModel.deleteOne({ _id: `${req.body._id}` });
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await CategoryModel.find()
      .sort({ date: -1 })
      .populate('articles');
    res.json(categories);
  } catch (err) {
    res.json({ message: err });
  }
});

app.post('/api/categories', jwtCheck, async (req, res) => {
  try {
    const user = (
      await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
        headers: { authorization: `${req.headers.authorization}` },
      })
    ).data;

    const data = (
      await axios.get(
        `http://localhost:${PORT}/api/role/${
          user !== undefined ? user.sub.toString() : ''
        }`
      )
    ).data;
    const isAdmin = data.role === 'Admin';

    if (!isAdmin) {
      throw Error('Вы не явлетесь администратором');
    }

    const category = new CategoryModel({
      title: req.body.title,
      description: req.body.description,
      articles: req.body.articles,
      imgURL: decodeURIComponent(req.body.imgURL),
    });

    const savedArticle = await category.save();
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.put('/api/categories', jwtCheck, async (req, res) => {
  try {
    if (req.body.action === 'edit') {
      const user = (
        await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
          headers: { authorization: `${req.headers.authorization}` },
        })
      ).data;

      const data = (
        await axios.get(
          `http://localhost:${PORT}/api/role/${
            user !== undefined ? user.sub.toString() : ''
          }`
        )
      ).data;
      const isAdmin = data.role === 'Admin';

      if (!isAdmin) {
        const articleAuthor = (
          await ArticleModel.find({
            _id: req.body.articleId,
          })
        )[0].author;
        if (user.nickname !== articleAuthor) {
          throw Error('Вы не явлетесь автором данной статьи');
        }
      }
    }
    const savedArticle = await CategoryModel.updateOne(
      { _id: req.body._id },
      { $set: { articles: req.body.articles } }
    );

    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.delete('/api/categories', jwtCheck, async (req, res) => {
  try {
    const user = (
      await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
        headers: { authorization: `${req.headers.authorization}` },
      })
    ).data;

    const data = (
      await axios.get(
        `http://localhost:${PORT}/api/role/${
          user !== undefined ? user.sub.toString() : ''
        }`
      )
    ).data;
    const isAdmin = data.role === 'Admin';

    if (!isAdmin) {
      throw Error('Вы не явлетесь администратором');
    }

    (
      await CategoryModel.findOne({
        title: `${req.body.title}`,
      })
    ).articles.forEach(async (article) => {
      await ArticleModel.deleteOne({ _id: `${article}` });
    });

    await CategoryModel.deleteOne({ title: `${req.body.title}` });
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.put('/api/category', jwtCheck, async (req, res) => {
  try {
    const user = (
      await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
        headers: { authorization: `${req.headers.authorization}` },
      })
    ).data;

    const data = (
      await axios.get(
        `http://localhost:${PORT}/api/role/${
          user !== undefined ? user.sub.toString() : ''
        }`
      )
    ).data;
    const isAdmin = data.role === 'Admin';

    if (!isAdmin) {
      throw Error('Вы не явлетесь администратором');
    }

    console.log(req.body);
    const savedArticle = await CategoryModel.updateOne(
      { title: req.body.oldTitle },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          imgURL: decodeURIComponent(req.body.imgURL),
        },
      }
    );
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.get('/api/role/:id', async (req, res) => {
  var optionsAPI = {
    method: 'POST',
    url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    data: {
      grant_type: 'client_credentials',
      client_id: `${process.env.AUTH0_CLIENT_ID}`,
      client_secret: `${process.env.AUTH0_CLIENT_SECRET}`,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    },
  };
  apiToken = (await axios.request(optionsAPI)).data.access_token;

  const options = {
    method: 'GET',
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${req.params.id}/roles`,
    headers: {
      authorization: `Bearer ${apiToken}`,
    },
  };

  try {
    const userData = await axios.request(options);
    res.status(200).json({
      role: userData.data.length !== 0 ? userData.data[0].name : null,
    });
  } catch (err) {
    if (req.body.id !== '') {
      res.status(400).json({ err });
    } else {
      res.status(200).json({ role: null });
    }
  }
});

app.use(express.static('../frontend/build'));

app.get('/*', (req, res) => {
  res.sendFile('../frontend/build/index.html');
});

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
