---
title: "构建一个简单的组件"
tocTitle: "简单 组件"
description: "单独构建一个简单的组件"
commit: 403f19a
---

我们将按照[组件驱动开发](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (CDD) 方法论来 构建我们的UI. 这是一个从"自下而上"开始构建UI的过程,从组件开始到整个页面结束. CDD 可帮助您在构建UI时,摆列您所面临的复杂程度. 

## 任务-Task

![Task component in three states](/task-states-learnstorybook.png)

`Task`是我们的应用程序的核心组件. 每个任务的显示略有不同,具体取决于它所处的`状态-state`. 我们显示一个选中 (或未选中) 复选框,一些有关任务的信息,以及一个"pin"按钮,允许我们在列表中上下移动任务. 为了把各个它们摆在一起,我们需要下面的 **props**: 

-   `title` - 描述任务的字符串

-   `state` - 哪个列表是当前的任务,是否已检查?

在我们开始构建`Task`时,我们首先编写 与 上面草图中不同类型的任务 相对应的测试状态. 然后我们使用 Storybook 模拟数据 隔离对应状态组件. 我们将"视觉测试"组件在每个状态下的外观. 

这个过程类似于[测试驱动的开发(TDD)](https://en.wikipedia.org/wiki/Test-driven_development),我们可以称之为["Visual-虚拟 TDD"](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)

## 获取设置

首先,让我们创建任务组件 及 其附带的 *storybook-故事* 文件: 

`src/components/Task.js`和`src/components/Task.stories.js`

我们将从基本实现开始,简单传入我们需要的`属性-props` 以及 您可以对任务执行的两个`on`操作 (在列表之间移动它) : 

```javascript
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

上面,我们基于 Todos应用程序现有HTML结构 为 `Task`提供简单的 markup . 

下面, 我们在 故事文件中 构建 Task的 三个测试状态: 


```javascript
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Task from './Task';

export const task = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const actions = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

storiesOf('Task', module)
  .add('default', () => <Task task={task} {...actions} />)
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />);
```

Storybook中有两个基本的组织级别. 

该组件 及 其 child 故事. 

将每个故事 视为组件的排列. 您可以根据需要为每个组件 创建 尽可能多的故事. 

-   **组件**
    -   故事
    -   故事
    -   故事

要开始 Storybook,我们先运`行 注册组件的`storiesOf()`函数. 我们为组件添加 *显示名称 -  Storybook应用程序侧栏上显示的名称*. 

`action()`允许我们创建一个回调, 当在Storybook UI的面板中 单击这个 **action** 时 回调触发. 因此,当我们构建一个pin按钮 时,我们将能够在 测试UI中 确定按钮单击 是否成功. 

由于我们需要将 相同的一组操作 传递给 组件的所有排列,因此将它们捆绑到`actions`变量 并 使用React`{...actions}`的`porps`扩展以立即传递它们. `<Task {...actions}>`相当于`<Task onPinTask={actions.onPinTask} onArchiveTask={actions.onArchiveTask}>`. 

关于捆绑`actions`的另一个好处就是,你可以`export-暴露`它们,用于重用该组件的组件,我们稍后会看到. 

为了定义我们的故事,我们用`add()`,一次一个为我们的每个测试状态生成一个故事. `add`第二个参数是一个函数,它返回一个给定状态的渲染元素 (即带有一组`props`的组件类)  - 就像一个React[无状态功能组件](https://reactjs.org/docs/components-and-props.html). 

在创建故事时,我们使用基本任务 (`task`) 构建组件期望的 任务的形状. 这通常是 根据真实数据的模型建模的. 再次,正如我们所看到的,`export`这种形状将使我们能够在以后的故事中重复使用它. 

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Actions</b></a> 帮助您在隔离构建UI组件时 验证交互. 通常，您无法访问应用程序上下文中的函数和状态。 使用 <code>action()</code> 将它们存入.
</div>

## 配置

我们还必须对 Storybook的配置设置 (`.storybook/config.js`) 做一个小改动,让它注意到我们的`.stories.js`文件并使用我们的CSS文件. 默认情况下, Storybook 会查找故事`/stories`目录; 本教程使用类似于`.test.js`的命名方案, 这个命令是 **CRA** 赞成的用于自动化测试的方案. 

```javascript
import { configure } from '@storybook/react';
import '../src/index.css';

const req = require.context('../src', true, /\.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

完成此操作后,重新启动 Storybook服务器 应该会产生 三个任务状态的测试用例: 

<video autoPlay muted playsInline controls >
  <source
    src="/inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## 建立状态

现在我们有 Storybook设置,导入的样式和构建的测试用例,我们可以快速开始实现组件的HTML,以匹配设计. 

该组件目前仍然是基本的. 首先编写实现设计的代码,不用过多细节: 

```javascript
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={state === 'TASK_ARCHIVED'}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="title">
        <input type="text" value={title} readOnly={true} placeholder="Input title" />
      </div>

      <div className="actions" onClick={event => event.stopPropagation()}>
        {state !== 'TASK_ARCHIVED' && (
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
```

上面的附加 markup 与我们之前导入的CSS相结合,产生以下UI: 

<video autoPlay muted playsInline loop>
  <source
    src="/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## 特别数据要求

最好的做法是`propTypes`在React中 指定组件所需的 数据形状. 它不仅可以自我记录,还有助于及早发现问题. 

```javascript
import React from 'react';
import PropTypes from 'prop-types';

function Task() {
  ...
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
  onArchiveTask: PropTypes.func,
  onPinTask: PropTypes.func,
};

export default Task;
```

现在,如果任务组件被滥用,则会出现开发警告. 

<div class="aside">
另一种实现方法是使用 类似TypeScript的JavaScript类型系统 来为组件属性 创建类型。
</div>

## 组件构建!

我们现在已成功构建了一个组件,没用到服务器或运行整个前端应用程序. 下一步是以类似的方式逐个构建剩余的 Taskbox组件. 

如您所见,开始单独构建组件非常简单快捷. 我们可以期望生成更高质量的UI,减少错误和更多打磨,因为它可以挖掘并测试每个可能的状态. 

## 自动化测试

 Storybook 为我们提供了一种在施工期间,`可视化`测试我们的应用程序.在我们继续开发应用程序时,"故事"将有助于确保我们不会在视觉上打破我们的任务. 
 但是,在这个阶段,这是一个完全手动的过程,有人必须努力点击每个测试状态,并确保它呈现良好且没有错误或警告. 
 我们不能自动这样做吗?

### 快照测试

快照测试是指,记录 带一定输入的组件的"已知良好"输出,然后,将来 输出发生变化时标记组件 的做法. 
这补充了 Storybook,因为快照 是查看 组件新版本 并 检查更改的快速方法. 

<div class="aside">
确保您的组件呈现 <b>不变</b> 的数据，以便每次快照测试都不会失败。 注意日期或随机生成的值等内容。
</div>

需要[Storyshots 插件](https://github.com/storybooks/storybook/tree/master/addons/storyshots)为每个故事创建 快照测试. 
通过添加开发依赖项来使用它: 

```bash
yarn add --dev @storybook/addon-storyshots react-test-renderer
```

然后创建一个`src/storybook.test.js`文件中包含以下内容: 

```javascript
import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

完成上述操作后,我们就可以运行了`yarn test`并看到以下输出: 

![Task test runner](/task-testrunner.png)

我们现在为每个`Task`故事进行快照测试. 如果我们改变了`Task`的实现,我们会提示您验证更改. 
