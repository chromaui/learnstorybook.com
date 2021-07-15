---
title: '이해관계자를 위한 문서'
tocTitle: '문서'
description: '문서화를 통하여 디자인 시스템 도입을 촉진하기'
commit: '5ff2af9'
---

[전문적인](https://product.hubspot.com/blog/how-to-gain-widespread-adoption-of-your-design-system) [프론트엔드](https://segment.com/blog/driving-adoption-of-a-design-system/) [팀](https://medium.com/@didoo/measuring-the-impact-of-a-design-system-7f925af090f7)은 디자인 시스템이 얼마나 채택되었는지를 성공의 척도로 삼고 있습니다. 디자인 시스템 사용을 통한 개발 비용 절감이라는 이점을 완벽하게 누리기 위해서는 컴포넌트가 널리 사용되어야만 합니다. 그렇지 않다면, 이게 다 무슨 소용일까요?

이 장에서는 이해관계자가 앱에서 컴포넌트를 재사용 할 수 있도록 디자인 시스템 "사용자 설명서"를 만들 것입니다. 그 과정에서 Shopify, Microsoft, Auth0 및 영국 정부의 팀에서 사용하는 UI 문서 모범 사례를 알아볼 것입니다.

![스토리북을 사용하여 자동으로 문서 생성하기](/design-systems-for-developers/design-system-generate-docs.jpg)

## 문서화는 힘든 작업입니다.

UI를 공동으로 개발하는 작업환경에서 문서화가 매우 ​​중요하다는 것은 명백한 사실입니다. 문서는 팀이 공통 UI 컴포넌트를 언제 어떻게 사용해야 하는지 배울 때 도움이 됩니다. 그런데 문서화에는 왜 그렇게 큰 노력이 필요할까요?

이전에 문서를 만들어본 경험이 있다면, 아마 사이트 구조 혹은 테크니컬 라이터와의 논쟁과 같은 비문서화 작업에 시간을 많이 드는 경험을 한 적이 있을 것입니다. 그리고 문서를 배포했다고 하더라도, 계속 기능을 개발하면서 문서를 최신으로 유지하는 것은 힘든 일이었을 것입니다.

**대부분의 문서는 생성되는 즉시 구식이 되어 버립니다.** 구식이 된 문서는 디자인 시스템의 컴포넌트에 대한 신뢰를 약화시키기 때문에, 개발자가 존재하는 컴포넌트를 재사용하는 대신 새 컴포넌트를 만들어 사용해 버리는 상황을 초래합니다.

## 요구 사항

우리의 문서화 작업은 기존에 문서를 만들고 유지하는 데에 동반되었던 어려움을 타파할 수 있는 새로운 방식이어야만 합니다. 우리가 달성해야 할 가치는 다음과 같습니다.

- **🔄최신 상태 유지**를 위한 최신 프로덕션 코드 사용
- **✍️글쓰기를 용이하게** 하기 위한 마크다운과 같은 친숙한 쓰기 도구를 사용
- **⚡️유지보수 시간 단축**을 통해 팀이 글쓰기에만 집중 가능한 환경 조성
- **📐상용구 기능**을 제공하여 개발자가 공통 패턴을 재작성 하는 것을 방지
- **🎨맞춤형 기능**을 제공하여 특히 복잡한 유즈 케이스 및 컴포넌트를 위한 유용성 제공

스토리북을 사용하게 되면 다양한 컴포넌트 종류를 이미 문서화된 스토리로 접할 수 있기 때문에 시작이 수월한 편입니다. 왜냐하면 스토리는 컴포넌트가 어떻게 주어지는 다양한 입력(props)과 함께 어떻게 동작하는지를 보여주기 때문입니다. 스토리는 프로덕션 컴포넌트를 사용하기 때문에 작성하기 쉽고 자체 업데이트도 가능합니다. 또한 스토리는 이전 테스트장에서 언급되었던 도구를 사용하여 회귀 테스트를 할 수도 있습니다.

> 스토리를 작성하면 컴포넌트 prop 문서와 사용 예제를 덤으로 받을 수 있습니다! – Justin Bennett, Artsy 엔지니어

## 스토리 작성, 문서 생성

스토리북 Docs 애드온을 사용하면 기존 스토리를 기반으로 문서를 생성하여 유지 관리 시간을 줄이고 유용한 기본 설정을 얻을 수 있습니다. 먼저 디자인 시스템 디렉터리로 이동한 다음 docs 애드온을 설치합니다.

스토리북 Docs 애드온을 사용하면 기존 스토리에서 기본 설정을 가져와서 유지 관리 시간을 절감할 수 있는 풍부한 문서를 생성할 수 있습니다.
[빌드](/react/ko/build/)챕터(Controls 및 Actions)에서 다룬 애드온들과 마찬가지로 Docs 애드온도 각 스토리북 설치에 포함하고 설정될 수 있으므로 좋은 문서를 작성하는 데에만 집중할 수 있습니다.

스토리 북을 열 때마다 두 개의 탭이 표시됩니다.

- 🖼️ "Canvas" 탭은 컴포넌트 개발 환경입니다.
- 📝 "Docs" 탭은 컴포넌트 문서를 보여줍니다.

![스토리북 문서 탭](/design-systems-for-developers/storybook-docs-6-0.png)

스토리북 Docs 애드온은 각 컴포넌트에 대한 새로운 "Docs" 탭을 만들었습니다. 그리고 탭 내부를 대화식 미리 보기, 소스 코드 뷰어 및 인자 테이블과 같이 자주 사용되는 내용으로 구성하였습니다. Shopify 및 Auth0의 디자인 시스템 문서에서 유사한 기능을 찾을 수 있습니다. 모두 2분 이내에 완료됩니다.

## 문서 확장

지금까지 우리는 적은 노력으로 많은 진전을 이루었습니다. 그러나 문서에는 여전히 _사람의 손길_ 이 닿지 않았습니다. 우리는 다른 개발자에게 더 많은 문맥(왜, 언제, 어떻게)을 제공할 필요가 있습니다.

컴포넌트의 기능을 설명하는 메타 데이터를 추가는 것으로 시작하세요. `src/Avatar.stories.js`에, Avatar의 용도를 설명하는 부제를 추가하세요.

```javascript
// src/Avatar.stories.js

export default {
  title: 'Design System/Avatar',
  component: Avatar,
  parameters: {
    componentSubtitle: '사용자 또는 조직을 나타내는 이미지를 표시합니다.',
  },
};
```

다음으로는 Avatar 컴포넌트 (`src/Avatar.js`에 위치)에 대한 설명을 제공하는 JSdoc를 추가합니다.

```javascript
// src/Avatar.js

/**
- Avatar를 사용하여 특정 사용자에게 액션이나 콘텐츠를 제공합니다.
- Avatar를 사용할 때 사용자 이름은 항상 Avatar 옆에 인쇄되거나 툴팁에 표시되어야 합니다.
**/

export function Avatar({ loading, user name, src, size, ... props }) {
```

이제 다음을 확인할 수 있습니다.:

![컴포넌트 세부 정보가 있는 스토리북 문서 탭](/design-systems-for-developers/storybook-docspage-6-0.png)

스토리북 Docs에 스토리 종류와 기본값을 보여주는 인자 테이블이 자동으로 생성되었습니다. 이 방식은 편리하지만, Avatar가 완벽하게 구현되었다는 것을 의미하는 것은 아닙니다. 몇몇 인자들(props)을 오용할 가능성이 있습니다. 자동 생성된 prop 테이블에서 Avatar를 렌더링하려면 프로토타입 내부에 을 추가하면 됩니다.

```javascript
// src/components/Avatar.js

Avatar.propTypes = {
  /**
    로딩 상태를 사용하여 Avatar에 필요한 데이터가 아직 로딩 중임을 나타냅니다.
    */
  loading: PropTypes.bool,
  /**
    Avatar는 이미지가 제공되지 않으면 사용자의 이니셜로 돌아갑니다.
    `username`을 제공하고 `src`를 생략하는 방법으로 이것이 어떻게 생겼는지 확인해 보세요.
    */
  username: PropTypes.string,
  /**
    Avatar 이미지의 URL입니다.
    */
  src: PropTypes.string,
  /**
    Avatar는 4가지 크기로 제공됩니다. 대부분의 경우 '중간'크기로 지정됩니다.
    */
  size: PropTypes.oneOf(Object.keys(sizes)),
};
```

기본적으로 모든 Avatar 스토리는 문서로 렌더링 됩니다. 우리는 다른 개발자들이 각 스토리에 대한 내용을 알고 있다고 가정할 수 없습니다. 스토리에 대한 설명을 'src/Avatar.stories.js'에 작성합니다.

```javascript
// src/Avatar.stories.js

export const Sizes = args => (
  <div>
    <Avatar {...args} size="large" />
    <Avatar {...args} size="medium" />
    <Avatar {...args} size="small" />
    <Avatar {...args} size="tiny" />
  </div>
);

Sizes.args = {
  username: 'Tom Coleman',
  src: 'https://avatars2.githubusercontent.com/u/132554',
};

Sizes.parameters = {
  docs: {
    // 스토리는 이제 설명을 포함합니다.
    storyDescription: '4 sizes are supported.',
  },
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-docspage-expanded-6-0.mp4"
    type="video/mp4"
  />
</video>

#### Markdown/MDX를 사용한 Supercharge 문서화

모든 컴포넌트는 다르기 때문에 문서화에 대한 요구사항도 마찬가지로 다릅니다. 위에서 스토리북 Docs를 사용하여 무료로 모범 사례 문서를 생성해보았습니다. 부가적인 정보를 추가한 후에, 컴포넌트에 대한 몇 가지 문제를 살펴보겠습니다.

Markdown은 텍스트 작성을 위한 직관적인 서식입니다. MDX를 사용하면 Markdown 내에서 대화형 코드 (JSX)를 사용할 수 있습니다. 스토리북 Docs는 MDX를 사용하여 개발자가 문서 렌더링 방식을 완벽하게 제어할 수 있도록 합니다.

Storybook 설치 절차에서 MDX 파일이 기본적으로 등록됩니다. `.storybook/main.js`는 다음과 같이 생겼습니다.

```javascript
// .storybook/main.js

module.exports = {
  // *.stories.js|mdx로 끝나는 모든 파일을 자동으로 가져옵니다.
  stories: ['../src/**/*.stories.(js|mdx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
};
```

새`src/Avatar.stories.mdx` 파일을 만들고 세부 정보를 제공합니다. `Avatar.stories.js` 파일을 제거하고 mdx 파일에 스토리를 다시 생성합니다.

<!-- prettier-ignore-start -->

```javascript
// src/Avatar.stories.mdx

import { Meta, Story, Canvas } from '@storybook/addon-docs/blocks';

import { Avatar } from './Avatar';

<Meta title="Design System/Avatar" component={Avatar} />

# Avatar

## 사용자 또는 조직을 나타내는 이미지를 표시합니다.

특정 사용자에게 액션이나 콘텐츠를 제공하기 위해 Avatar를 사용합니다. 

Avatar를 사용할 때는 사용자 이름이 _항상_ Avatar의 옆이나 툴팁에 보입니다.

<Story name="standard">
  <Avatar
    size="large"
    username="Tom Coleman"
    src="https://avatars2.githubusercontent.com/u/132554"
  />
</Story>

### Sizes

4가지 크기가 지원됩니다.

<Story name="sizes">
  <div>
    <Avatar
      size="large"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="medium"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="small"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="tiny"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
  </div>
</Story>

### 기본값

`src` prop에 이미지가 제공되지 않으면 Avatar는 이니셜을 표시합니다.

Avatar가 이미지에 접근할 수 없는 상황은 지양해야 합니다.

<Story name="initials">
  <div>
    <Avatar username="Tom Coleman" />
    <Avatar username="Dominic Nguyen" />
    <Avatar username="Kyle Suss" />
    <Avatar username="Michael Shilman" />
  </div>
</Story>

### Loading

로딩 상태는 이미지 또는 사용자 이름이 로드 중일 때 사용됩니다.

<Story name="loading">
  <div>
    <Avatar size="large" loading />
    <Avatar size="medium" loading />
    <Avatar size="small" loading />
    <Avatar size="tiny" loading />
  </div>
</Story>

### Playground

Canvas 탭에서 Controls 애드온으로 이 스토리를 실험해보세요.

export const Template = (args) => <Avatar {...args} />
<Canvas>
  <Story name="controls" args={{
    loading: false,
    size: "tiny",
    username: "Dominic Nguyen",
    src: "https://avatars2.githubusercontent.com/u/263385"
  }}>
    {Template.bind({})}
  </Story>
</Canvas>
```

<!-- prettier-ignore-end -->

스토리북에서 Avatar 컴포넌트의 "Docs" 탭은 MDX 페이지로 대체되었을 것입니다.

![MDX로 생성한 스토리북 docs](/design-systems-for-developers/storybook-docs-mdx-initial-6-0.png)

스토리북은 대화식 미리 보기, 인자 테이블 등과 같은 미리 만들어진 컴포넌트인 [“Doc Blocks”](https://storybook.js.org/docs/react/writing-docs/doc-blocks)와 함께 제공됩니다. 기본적으로 자동 생성된 문서 페이지에 적용되어 있습니다. 그뿐만 아니라 개별 사용을 위해 추출할 수도 있습니다. 우리의 목표는 모든 것을 직접 다시 작업하지 않고 맞춤형 Avatar의 문서를 생성하는 것이므로, 가능한 곳에서는 Doc Blocks를 재사용하도록 합시다.

[`ArgsTable`](https://storybook.js.org/docs/react/writing-docs/doc-blocks#mdx)과 doc block을 추가하고 초기 스토리를 `Preview`로 래핑 하겠습니다.

```javascript
// src/Avatar.stories.mdx

import { Meta, Story, ArgsTable, Preview } from '@storybook/addon-docs/blocks';

# …

<Preview withToolbar>
  <Story name="standard">
    <Avatar
      size="large"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
  </Story>
</Preview>

<ArgsTable of={Avatar} />
```

![doc blocks와 MDX로 만든 스토리북 문서](/design-systems-for-developers/storybook-docs-mdx-docblocks-6-0.png)

좋아요! 처음 시작했던 곳으로 돌아왔지만, 이전과는 다르게 콘텐츠의 내용과 순서를 완벽하게 제어할 수 있습니다. 자동화된 문서 생성의 이점은 우리가 Doc Blocks를 사용하고 있기 때문에 계속 누릴 수 있습니다.

Avatar의 문서를 유즈 케이스에 대한 노트를 통하여 맞춤형으로 생성 해봅시다. 이는 개발자에게 해당 컴포넌트를 활용하는 방법에 대한 문맥을 제공합니다. 또한, 다른 마크다운 문서에서 했던 것처럼 마크다운을 추가할 수 있습니다.

```javascript
// src/Avatar.stories.mdx

// Same content as before

<ArgsTable of={Avatar} />

## Usage

Avatar는 사람이나 조직을 나타내는 데 사용됩니다. Avatar는 기본적으로 이미지를 보여주고, 이미지가 없는 경우에는 사용자 이름의 첫 번째 이니셜이 들어갑니다. 컴포넌트를 하이드레이팅 하는 동안 Avatar가 데이터를 기다리고 있음을 나타내는 스켈레톤 템플릿을 렌더링하는 것이 유용할 수 있습니다. Avatar들을 AvatarList 컴포넌트로 그룹화할 수 있습니다.

### Sizes

// Same content as before

```

![사용법 정보가 포함된 MDX 용 스토리북 docs](/design-systems-for-developers/storybook-docs-mdx-usage-6-0.png)

#### 맞춤 페이지

모든 디자인 시스템에는 표지가 함께 제공됩니다. 스토리북 Docs에서는 MDX를 사용하여 개별 페이지를 만들 수 있습니다.

새 파일 생성 `src/components/Intro.stories.mdx`:

```javascript
// src/components/Intro.stories.mdx

import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Design System/Introduction" />

# 스토리북 디자인 시스템을 배우는 방법 소개

스토리북 디자인 시스템을 배우는 방법은 전체 [스토리북 디자인 시스템]의 일부입니다.(https://github.com/storybookjs/design-system/), 모범 사례 기술을 사용하여 디자인 시스템을 작성하고 게시하는 방법을 배우는 데 관심이 있는 사람들을 위한 학습 리소스로 만들어졌습니다.

[스토리북 배우기]에서 자세히 알아보기(https://learnstorybook.com).
```

이렇게 하면 이전의 자동화된 컴포넌트 문서 페이지와 독립적인 새로운 문서 전용 페이지가 생성됩니다.

![소개 페이지가 있는 스토리북 문서, 정렬되지 않음](/design-systems-for-developers/storybook-docs-introduction-unsorted.png)

맨 위에 나타나게 하려면 스토리북에 '.storybook/main.js'에 소개 파일을 로드하도록 지시해야 합니다.

```javascript
// .storybook/main.js

module.exports = {
  // 스토리의 로드 순서를 변경합니다. Intro 페이지를 첫 번째로 로드하고,
  // * .stories.js | mdx로 끝나는 모든 파일을 자동으로 가져옵니다.
  stories: [
    '../src/components/Intro.stories.mdx',
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-a11y',
  ],
};
```

![소개 페이지가 포함 된 스토리북 문서](/design-systems-for-developers/storybook-docs-introduction-6-0.png)

## 온라인에 문서 게시

아무도 읽지 않는 문서는 유용할까요? 그렇지 않습니다. 학습 자료를 고품질로 만드는 것만으로는 충분하지 않습니다. 이해관계자와 동료에게 해당 자료를 공개해야 합니다. 현재 우리 문서는 저장소에 묻혀 있습니다. 즉, 문서를 보려면 디자인 시스템의 스토리북을 로컬에서 실행해야 합니다.

이전 장에서는 시각적 검토를 위해 온라인으로 스토리북을 게시했습니다. 컴포넌트 문서도 동일한 방식을 사용하여 쉽게 게시할 수 있습니다. docs 모드에서 스토리북을 빌드하기 위해 `package.json`에 새 스크립트를 추가해 보겠습니다.

```json
{
  "scripts": {
    "build-storybook-docs": "build-storybook -s public --docs"
  }
}
```

저장하고 커밋 합니다.

명령 줄 또는 지속적 통합 도구에서 `build-storybook-docs`를 실행하면 "docs" 구성에 정적 사이트가 출력됩니다. 정적 사이트 배포 도구 [Netlify](https://www.netlify.com/) 또는 [Vercel](https://vercel.com/)을 설정하여 모든 커밋마다 문서 사이트가 배포됩니다.

<div class="aside">디자인 시스템이 성장함에 따라 맞춤화된 도구나 Gatsby 또는 Next와 같은 도구를 사용하여 고유한 정적 사이트를 구축하는 것을 보장하라는 조직별 요구 사항에 직면할 수 있습니다. 마크다운 및 MDX를 다른 솔루션으로 쉽게 이식할 수 있습니다.</div>

## 다른 앱으로 디자인 시스템 가져오기

지금까지 우리는 내부적인 것에 집중했습니다. 우선, 내구성 있는 UI 컴포넌트를 만들고, 그것을 검토, 테스트 및 문서화하는 것을 살펴보았습니다. 이제 우리는 팀이 디자인 시스템을 사용하는 방식을 조사하기 위해 외적인 부분을 살펴볼 것입니다.

7장에서는 다른 앱에서 사용할 수 있도록 디자인 시스템을 패키징하는 방법을 설명합니다. JavaScript 패키지 관리자인 npm과 시간을 절약하는 배포 관리 도구인 Auto를 결합하는 방법을 알아봅니다.
