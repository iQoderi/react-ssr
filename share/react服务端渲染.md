---
title: react 服务端渲染实践
comments: true
date: 2017-03-05 14:30:10
tags:
 - react ssr
categories: Qoder博客
description: react 服务端渲染
---

###为什么要用服务端渲染
1. SEO，让搜索引擎更容易读取页面内容
2. 首屏渲染速度更快（重点），无需等待js文件下载执行的过程
3. 更易于维护，服务端和客户端可以共享某些代码

###服务端渲染要解决的问题
1. 如何实现组件同构？
2. 如何保持前后端应用状态一致？
3. 如何解决前后端路由匹配问题？
4. 如何处理服务端对静态资源的依赖？
5. 如何配置两套不同的环境（开发环境和产品环境？

###服务端渲染原理

![ssr](http://upload-images.jianshu.io/upload_images/4145295-df8e7f9aa01f3448.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###同构方案
这里我们采用React技术体系做同构，由于React本身的设计特点，它是以Virtual DOM的形式保存在内存中，这是服务端渲染的前提。

对于客户端我们还和以前一样，通过调用ReactDOM.render方法把Virtual DOM转换成真实DOM最后渲染到界面。

```javascript

import { render } from 'react-dom'
import App from './App'

render(<App />, document.getElementById('root'))

```

对于服务端，通过调用ReactDOMServer.renderToString方法把Virtual DOM转换成HTML字符串返回给客户端，从而达到服务端渲染的目的。

```javascript

import { renderToString } from 'react-dom/server'
import App from './App'

async function(ctx) {
    await ctx.render('index', {
        root: renderToString(<App />)
    })
}

```

###状态管理方案

选择Redux来管理React组件的非私有组件状态，并配合社区中强大的中间件Devtools、Thunk、redux-saga(强烈推荐)等等来扩充应用。当进行服务端渲染时，创建store实例后，还必须把初始状态回传给客户端，客户端拿到初始状态后把它作为预加载状态来创建store实例，否则，客户端上生成的markup与服务端生成的markup不匹配，客户端将不得不再次加载数据，造成没必要的性能消耗。

* 服务端
```javascript

import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from './App'
import rootReducer from './reducers'

const store = createStore(rootReducer)

async function(ctx) {
    await ctx.render('index', {
        root: renderToString(
            <Provider store={store}>
                <App />
            </Provider>
        ),
        state: store.getState()
    })
}

```

* html,这里我们采用ejs做模板引擎
```html

<body>
    <div id="root"><%- root %></div>
    <script>
        window.REDUX_STATE = <%- JSON.stringify(state) %>
    </script>
</body>

```

*客户端
```javascript
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from './App'
import rootReducer from './reducers'

const store = createStore(rootReducer, window.REDUX_STATE)

render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
)
```

### 路由方案

客户端可以不依赖服务端，根据hash方式或者调用history API，不同的URL渲染不同的视图，实现无缝的页面切换，用户体验极佳。但服务端渲染不同的地方在于，在渲染之前，必须根据URL正确找到相匹配的组件返回给客户端。
React Router为服务端渲染提供了两个API：
- match 在渲染之前根据URL匹配路由组件
- RoutingContext 以同步的方式渲染路由组件

* 服务端
```javascript

import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { match, RouterContext } from 'react-router'
import rootReducer from './reducers'
import routes from './routes'

const store = createStore(rootReducer)

async function clientRoute(ctx, next) {
    let _renderProps

    match({routes, location: ctx.url}, (error, redirectLocation, renderProps) => {
        _renderProps = renderProps
    })

    if (_renderProps) {
        await ctx.render('index', {
            root: renderToString(
                <Provider store={store}>
                    <RouterContext {..._renderProps} />
                </Provider>
            ),
            state: store.getState()
        })
    } else {
        await next()
    }
}

```

* 客户端
```javascript

import { Route, IndexRoute } from 'react-router'
import Common from './Common'
import Home from './Home'
import Explore from './Explore'
import About from './About'

const routes = (
    <Route path="/" component={Common}>
        <IndexRoute component={Home} />
        <Route path="explore" component={Explore} />
        <Route path="about" component={About} />
    </Route>
)

export default routes

```

### 静态资源处理方案

在客户端中，我们使用了大量的ES6/7语法，jsx语法，css资源，图片资源，最终通过webpack配合各种loader打包成一个文件最后运行在浏览器环境中。但是在服务端，不支持import、jsx这种语法，并且无法识别对css、image资源后缀的模块引用，那么要怎么处理这些静态资源呢？我们需要借助相关的工具、插件来使得Node.js解析器能够加载并执行这类代码，下面分别为开发环境和产品环境配置两套不同的解决方案

* 开发环境
1. 首先引入babel-polyfill这个库来提供regenerator运行时和core-js来模拟全功能ES6环境。
2. 引入babel-register，这是一个require钩子，会自动对require命令所加载的js文件进行实时转码，需要注意的是，这个库只适用于开发环境。
3. 引入css-modules-require-hook，同样是钩子，只针对样式文件，由于我们采用的是CSS Modules方案，并且使用SASS来书写代码，所以需要node-sass这个前置编译器来识别扩展名为.scss的文件，当然你也可以采用LESS的方式，通过这个钩子，自动提取className哈希字符注入到服务端的React组件中。
4. 引入asset-require-hook，来识别图片资源，对小于8K的图片转换成base64字符串，大于8k的图片转换成路径引用。

```javascript

require('babel-polyfill')

// Javascript required hook
require('babel-register')({presets: ['es2015', 'react', 'stage-0']})

// Css required hook
require('css-modules-require-hook')({
    extensions: ['.scss'],
    preprocessCss: (data, filename) =>
        require('node-sass').renderSync({
            data,
            file: filename
        }).css,
    camelCase: true,
    generateScopedName: '[name]__[local]__[hash:base64:8]'
})

// Image required hook
require('asset-require-hook')({
    extensions: ['jpg', 'png', 'gif', 'webp'],
    limit: 8000
})

```

* 产品环境
- 对于产品环境，采用做法是使用webpack分别对客户端和服务端代码进行打包。客户端代码打包这里不多说，对于服务端代码，需要指定运行环境target为node，并且提供polyfill，设置__filename和__dirname为true，并且指定上下文context,并且提取出来css

```javascript

rules:[
  {
    test: /\.jsx?$/,
    loaders:isProd?'babel-loader':'react-hot-loader!babel-loader',
    exclude: /node_modules/,
  },
  {
    test: /\.css$/,
    loaders:isProd?ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use:['css-loader?minimize', 'postcss-loader']
    }):['style-loader', 'css-loader', 'postcss-loader']
  },
  {
    test: /\.scss/,
    loaders:isProd?ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use:['css-loader?minimize', 'postcss-loader', 'scss-loader']
    }):['style-loader', 'css-loader', 'postcss-loader','scss-loader']
  },
  {
    test: /\.(png|jpg|gif|woff|woff2)$/,
    loaders: [
      'url-loader?limit=10000&name=[chunkhash:8].[name].[ext]',
      'image-webpack-loader?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
    ]
  }
]

```

### 动态加载方案
- 对于大型Web应用程序来说，将所有代码打包成一个文件不是一种优雅的做法，特别是对于单页面应用，用户有时候并不想得到其余路由模块的内容，加载全部模块内容，不仅增加用户等待时间，而且会增加服务器负荷。Webpack提供一个功能可以拆分模块，每一个模块称为chunk，这个功能叫做Code Splitting。你可以在你的代码库中定义分割点，调用require.ensure，实现按需加载，而对于服务端渲染，require.ensure是不存在的，因此需要判断运行环境，提供钩子函数。

* 重构后的路由模块为
```javascript

// Hook for server
if (typeof require.ensure !== 'function') {
    require.ensure = function(dependencies, callback) {
        callback(require)
    }
}

const routes = {
    childRoutes: [{
        path: '/',
        component: require('./common/containers/Root').default,
        indexRoute: {
            getComponent(nextState, callback) {
                require.ensure([], require => {
                    callback(null, require('./home/containers/App').default)
                }, 'home')
            }
        },
        childRoutes: [{
            path: 'explore',
            getComponent(nextState, callback) {
                require.ensure([], require => {
                    callback(null, require('./explore/containers/App').default)
                }, 'explore')
            }
        }, {
            path: 'about',
            getComponent(nextState, callback) {
                require.ensure([], require => {
                    callback(null, require('./about/containers/App').default)
                }, 'about')
            }
        }]
    }]
}

```

### 最后献上demo
- 使用以上技术架构做了一个cnode社区demo,并且区分客户端渲染和服务端渲染

[非服务端渲染](cnode.qoder.cn)

![cnode1](http://odljp7x9v.bkt.clouddn.com/cnode/cnode1.png)

[服务端渲染](cnode2.qoder.cn)

![cnode2](http://odljp7x9v.bkt.clouddn.com/cnode/cnode2.png)

### demo地址
[http://c.sohuno.com/chaoqi002539/react-ssr.git](http://c.sohuno.com/chaoqi002539/react-ssr.git)

