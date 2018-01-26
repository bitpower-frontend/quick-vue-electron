[
  {
    title: '数据管理',        // 如果是菜单，作为菜单名，否则只作为页面标题
    name: 'data-manage',      // 指定组件名称，作为 vue 组件 name 以及相应路由 name 值
    filename: 'data-manage',  // 文件或文件夹名称
    path: '',                 // 页面路由
    isMenu: true,             // 是否作为菜单创建，如果是其下的子页面也会作为子菜单创建
    subPages: [               // 如果有此字段，将创建对应文件夹，否则只创建单个文件
      {
        title: '',
        name: '',
        filename: '',
        path: '',
        isMenu: false,
      },
      {
        title: '',
        name: '',
        filename: '',
        path: '',
      },
    ],
  },
]

// 1. 创建文件夹以及文件
// 2. 生成路由配置文件
// 3. 生成菜单