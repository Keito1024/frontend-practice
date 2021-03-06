## React.memo

コンポーネント（コンポーネントのレンダリング結果）をメモ化する React の API（メソッド）。

コンポーネントをメモ化することで、コンポーネントの再レンダリングをスキップできる。

### なぜ React.memo を利用するのか

以下のようなコンポーネントの再レンダリングをスキップすることで、パフォーマンスの向上が期待できるから。

- レンダリングコストが高いコンポーネント
- 頻繁に再レンダリングされるコンポーネント内の子コンポーネント

通常のコンポーネントに対しては、わざわざ`React.memo`を利用する必要はない。

### React.memo の構文

```js
React.memo(コンポーネント);
```

例えば、`Hello`というコンポーネントをメモ化する場合は以下のようになる。

```jsx
const Hello = React.memo(props => {
  return <h1>Hello {props.name}</h1>;
});
```

`React.memo`は Props の等価性（値が等価であること）をチェックして再レンダリングの判断をする。

新しく渡された Props と前回の Props を比較し、等価であれば再レンダリングをせずにメモ化したコンポーネントを再利用する。

そのため、上記の`Hello`コンポーネントの場合、`props.name`が更新されない限りコンポーネントは再レンダリングされない。

### React.memo の利用例

`React.memo`を利用する場合と、しない場合では何が違うのか比較してみる。

#### React.memo を利用しない場合

通常、コンポーネントの state が更新されると、そのコンポーネントは再レンダリングされる。

親コンポーネントが再レンダリングされると、その子コンポーネントも常に再レンダリングされる。

```jsx:App.js
import React, { useState } from "react";

const Child = props => {
  console.log("render Child");
  return <p>Child: {props.count}</p>;
};

export default function App() {
  console.log("render App");
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  return (
    <>
      <button onClick={() => setCount1(count1 + 1)}>countup App count</button>
      <button onClick={() => setCount2(count2 + 1)}>countup Child count</button>
      <p>App: {count1}</p>
      <Child count={count2} />
    </>
  );
}
```

これが通常の挙動なので、この書き方が悪いわけではなく、問題もない。

コンポーネントの不要な再レンダリングでパフォーマンスの問題が発生した場合、`React.memo`の利用を検討する。

今回は`Child`コンポーネントが常に再レンダリングされても何も問題はないため、`React.memo`を利用する必要はない。

#### レンダリングコストが高いコンポーネントをメモ化する

極端な例になるが、以下のデモのようにレンダリングコストが高いコンポーネントをメモ化することで、パフォーマンスの向上が期待できる。

```jsx:App.js
import React, { useState } from "react";

const Child = React.memo(props => {
  let i = 0;
  while (i < 1000000000) i++;
  console.log("render Child");
  return <p>Child: {props.count}</p>;
});

export default function App() {
  console.log("render App");

  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  return (
    <>
      <button onClick={() => setCount1(count1 + 1)}>countup App count</button>
      <button onClick={() => setCount2(count2 + 1)}>countup Child count</button>
      <p>App: {count1}</p>
      <Child count={count2} />
    </>
  );
}
```

#### 頻繁に再レンダリングされるコンポーネント内の子コンポーネントをメモ化する

頻繁に再レンダリングされるコンポーネント内の子コンポーネントをメモ化することで、パフォーマンスの向上が期待できる。

```jsx:App.js
import React, { useState, useEffect, useRef } from "react";

const Child = React.memo(() => {
  console.log("render Child");
  return <p>Child</p>;
});

export default function App() {
  console.log("render App");

  const [timeLeft, setTimeLeft] = useState(100);
  const timerRef = useRef(null);
  const timeLeftRef = useRef(timeLeft);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const tick = () => {
    if (timeLeftRef.current === 0) {
      clearInterval(timerRef.current);
      return;
    }
    setTimeLeft(prevTime => prevTime - 1);
  };

  const start = () => {
    timerRef.current = setInterval(tick, 10);
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setTimeLeft(100);
  };

  return (
    <>
      <button onClick={start}>start</button>
      <button onClick={reset}>reset</button>
      <p>App: {timeLeft}</p>
      <Child />
    </>
  );
}
```

### コールバック関数を Props として受け取ったコンポーネントは必ず再レンダリングされる

コールバック関数を受け取ったコンポーネントは`React.memo`を利用しても必ず再レンダリングされる。

```jsx:App.js
import React, { useState } from "react";

const Child = React.memo(props => {
  console.log("render Child");
  return <button onClick={props.handleClick}>Child</button>;
});

export default function App() {
  console.log("render App");

  const [count, setCount] = useState(0);
  // 関数はコンポーネントが再レンダリングされる度に再生成されるため、
  // 関数の内容が同じでも、新しい handleClick と前回の handleClick は
  // 異なるオブジェクトなので、等価ではない。
  // そのため、コンポーネントが再レンダリングされる。
  const handleClick = () => {
    console.log("click");
  };

  return (
    <>
      <p>Counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment count</button>
      <Child handleClick={handleClick} />
    </>
  );
}
```

以下のように参照が異なる関数は別のオブジェクトとなる。

```js
function doSomething() {
  console.log("doSomething");
}
const func1 = doSomething;
const func2 = doSomething;
console.log(doSomething === doSomething); // true
console.log(func1 === func2); // true

const func3 = () => {
  console.log("doSomething");
};
const func4 = () => {
  console.log("doSomething");
};
console.log(func3 === func4); // false
```

前述の`handleClick`が参照する関数も、`App`コンポーネントが再レンダリングされる度に再生成されるため、等価ではない。

そのため、関数の内容が同じでも`Child`コンポーネントが再レンダリングされる。

この問題を解消するためには、`useCallback`を利用して関数をメモ化する必要がある。

## useCallBack()
メモ化されたコールバック関数を返す

### なぜuseCallbackを使うのか
React.memoと併用することで、コンポーネントの不要な再レンダリングをスキップできるから。

より具体的に言えば、React.memoでメモ化したコンポーネントにuseCallbackでメモ化したコールバック関数を Props として渡すことで、コンポーネントの不要な再レンダリングをスキップできるから。

### 構文
```jsx
useCallback(コールバック関数、[依存配列])
```
例えば、helloという変数をconsole.logで出力するだけの関数をメモ化したい場合
```jsx
useCallback(() => console.log(hello), [hello])
```
依存している要素がなければからでもいい

## useMemo()
メモ化された値を返すフック。

コンポーネントの再レンダリング時に値を再利用できる。

### 構文
```jsx
useMemo(() => 値を計算するロジック, [依存配列])
```
不要な再計算をなくす、vueでいうcomputedの的なやつ

## eslint
### hooks plugin
eslint-plugin-react-hooks
  ```json
  {
    "plugins": [
      // ...
      "react-hooks"
    ],
    "rule": {
      // ...
      "react-hooks/rules-of-hooks": "error", // check rule of hooks
      "react-hooks/exhaustive-deps": "warning" // check effect dependencies
    }
  }
  ```

## test
- コンポーネントツリーのレンダリング をシンプルなテスト環境で行い、その結果を検証する
- アプリケーション全体の動作 をブラウザ同等の環境で検証する（end-to-end テストとして知られる）

### 推奨ツール
- Jest
jsdom を通じて DOM にアクセスできる JavaScript のテストランナーです。jsdom はブラウザの模倣環境にすぎませんが、React コンポーネントをテストするのには十分なことが多いです。Jest は モジュール や タイマー のモックのような機能を組み合わせて、高速にイテレーションを回すことができ、コードをどう実行するかをよりコントロールできます。

- React Testing Library
実装の詳細に依存せずに React コンポーネントをテストすることができるツールセットです。このアプローチはリファクタリングを容易にし、さらにアクセスビリティのベスト・プラクティスへと手向けてくれます。コンポーネントを children 抜きに「浅く」レンダリングする方法は提供していませんが、Jest のようなテストランナーで モック することで可能です

## CSS IN JS
JSX ファイルの中にスタイルを直 接書き込める
- styled-component
- emotion
star数でいうとstyled-componentのが多いが, npmのインストール数だと2020年入ってから圧倒的にemotionが上回ってる

### Emotion
スタイル適用、コンポーネント生成、オブジェクトスタイル、テンプレートスタイルが全部入りのCSS IN JSライブラリー
ファイルファイルサイズが小さく、実行速度も速い
EmotionのCSS prop形式では、styled-componentと比べて、マウント速度が4~5倍、レンダリング速度だと3倍早いらしい

- インストール方法
  ```sh
  yarn add @emotion/core
  ```
- 使い方
直っ感的にセグメントのpropとしてstyleを渡すことができる
  ```tsx
  // ファイル上部でコンパイラの宣言
  // @jsx jsx
  import { css, jsx } from '@emotion/core';
  export const Sample: React.FC = () => {
    return (
      // フラグメントは使えない
      <div>
        <button css={
          css`
          background-color: red;
          `
        }>
      </div>
    )
  }
  ```

  別でcssを変数定義してしまう場合
  ```tsx
  import { css, jsx} from '@emotion/core';

  const parent = css`
    background-color: #fff;
    color: #000;
  `;

  const child = css`
    ${parent};
    display: block;
    margin: 0 auto;
  `;
  export const Sample: React.FC = () => {
    return (
      <div>
      <button css={styles} />
      </div>
    )
  }
  ```
  * コンパイラが通らない時は
  ```json
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
    varsIgnorePattern: '[Rr]eact'
    }
  ],
  ```

### Storybook (style guide)
コンポーネントをカタログ化して、管理できるツールです。カタログ化することで、双方の行き違いを限りなく少なくできます。
そして、FigmaやAdobe XDと連携できるなど、開発者とデザイナーの両方に嬉しい拡張機能もあります。

- storybookインストール方法
  ```sh
  npx -p @storybook/cli sb init
  ```
  .storybook/main.jsで読み込む対象のstoriesの拡張子を変更する
  各コンポーネントに対応するtestを書く。拡張子は(.stories.tsx)
  `yarn storybook` してGUIを開いてstorybookの画面でコンポーネントを確認する

- storyshotを追加する(スナップショットを取ってテストする)
  ```sh
  yarn add -D @storybook/addon-storyshots react-test-renderer
  ```
  スナップショットを生成するためのファイルを作成する。
  ```js
  // src/storyshots.test.js
  import initStoryshots from '@storybook/addon-storyshots';
  initStoryshots();
  ```
  yarn testを実行するとスナップショットが作成される。
  それから各コンポーネントのテストを書く。(拡張子.test.tsx)
  最後に、以前とったスナップショットと比較テストして影響範囲などを可視化する。

### FormElement
onChangeのformから取得する際のイベントの型定義
```tsx
const Form: React.FC = () => {
  const [text, setText] = useState("")
  const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setText(e.currentValue.value)
  }
  return (
    <div>
      <input type="text" value={text} onChange={changeText} />
      <br />
    </div>
  )
}
```

### Context
下記がコンテキスト定義。
```tsx
// 型定義
type ContextSample = {
  userId: string
}

// Object
export const ctx: ContextSample = {
  userId: "xxxxxx"
}

// context
export const currentUserContext = React.createContext<ContextSample>(ctx)
```
これをProvideで定義してあげるとchildrenでcontextが参照可能になる
```tsx
<currentUserContext.Provider value={入れたい値}>
  <Component />
</currentUserContext.Provider>
```

### type vs interface
- 継承
  - interfaceとtypeはお互い継承は可能
```tsx
// interfaceの継承
interface IPoint2D {
  x: number;
  y: number;
}
interface IPoint3D extends IPoint2D {
  z: number;
}

// typeの継承もどき
type TPoint2D = {
  x: number;
  y: number;
}
type TPoint3D = TPoint2D & {
  z: number;
}

type TPoint4D = IPoitn3D & {
  z: number
}

interface IPoint4D extends TPoint2D {
  z: number
}
```

- 同盟宣言
  - interfaceは同じ名前で定義したものは一つにマージされる
  - typeは同盟定義できないためコンパイルエラーが起こる