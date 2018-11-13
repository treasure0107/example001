import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Login from '@/views/Login/Login'
import MemberPage from '@/views/Member/MemberPage'

Vue.use(Router);

const routes=[

	{
		path: '/Login',
		name: 'Login',
		component: Login
	},
	{
		path: '/',
		component: Index,
		children: [  //这里就是二级路由的配置
			// {
			// 	path: '/',
			// 	name: 'MemberPage',
			// 	component: MemberPage,
			// }
		]
	}
]

const importPages=(r)=>{
	r.keys().forEach(key => {
		let pathStr=key.replace(/^\.(\/.*)\.\w+$/, '$1');
		let nameStr=key.replace(/^\.\/(.*)\.\w+$/, '$1');
		//if(nameStr=='MemberPage') return;
		routes.find((item)=>item.path=='/').children.push({ path:pathStr,name:nameStr, component: r(key).default||r(key)})
	});
}

//为Sys配置路由
const requireSys = require.context(
  '@/views/Sys',//文件夹路径
  false,
  /\.vue$/
)
importPages(requireSys)

//为Sys配置路由
const requireMember = require.context(
  '@/views/Member',//文件夹路径
  false,
  /\.vue$/
)
importPages(requireMember)
//为Document配置路由
const requireDocument = require.context(
  '@/views/Document',//文件夹路径
  false,
  /\.vue$/
)
importPages(requireDocument)
//为委托交易管理配置路由
const requireEntrust = require.context(
  '@/views/Entrust',//文件夹路径
  false,
  /\.vue$/
)
importPages(requireEntrust)
const requireDepositWithdraw = require.context(
  '@/views/DepositWithdraw',//文件夹路径
  false,
  /\.vue$/
)
importPages(requireDepositWithdraw)
//加密货币管理
const requireCryptocurrency = require.context(
  '@/views/Cryptocurrency',//文件夹路径
  false,
  /\.vue$/
)
importPages(requireCryptocurrency)
//C2C
const requireC = require.context(
  '@/views/C2C',//文件夹路径
  false,
  /\.vue$/
);
importPages(requireC);
export default new Router({
  routes
});
