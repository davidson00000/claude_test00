# 作業まとめ (2025-08-24)

## 今日やったことの流れ

### 1. Node.js 環境準備
- Windows に nvm を入れて Node.js を切り替え
- `nvm install 20.11.1`
- `nvm use 20.11.1`

### 2. Expo プロジェクト作成と設定
- `npx create-expo-app hello-kosuke`
- `cd hello-kosuke`
- iOS 用に EAS を設定  
  ```bash
  eas build:configure
  ```

### 3. Apple Developer Program 更新
- アカウントを有効化し、EAS Build で実機向けのビルドが可能に

### 4. 開発ビルド (Dev Client) 作成
- EAS で iOS の Development Build を作成  
  ```bash
  eas build --profile development --platform ios
  ```
- 出来上がった .ipa を iPhone にインストール  
  (Safari で Expo の build ページを開いて Install)

### 5. 実機での起動方法
- PC 側で開発サーバを起動  
  ```bash
  npx expo start --dev-client --tunnel
  ```
- iPhone 上の **hello-kosuke (Development Build)** アプリを起動  
  - 表示された QR コードを読み取るか、`Fetch development servers` で接続  
  - App.js の最新コードが即時反映される

### 6. App.js 更新と動作確認
- `App.js` を編集（HomeScreen, DetailsScreen, SettingsScreen, タブ化、ダークテーマ切替）
- 保存すると、iPhone 上のアプリに即反映  
- 状態管理: `useState`, `useEffect` を学習  
- AsyncStorage を使った名前保存・リセットを実装

### 7. GitHub 関連
- `git init` でリポジトリ初期化
- `git add README.md`
- `git commit -m "add README.md"`
- `git push origin main` で GitHub に README だけ push
- 古い不要なリポジトリは GitHub の Settings → Danger Zone → Delete this repository で削除

---

## 今日の理解ポイント
- `useState` は状態を保持するためのフック (`[値, 更新関数]` を返す)
- `setName` は「状態を変えたよ」と React に知らせる連絡係 → React が再描画
- `useEffect(..., [])` は初回描画後に一度だけ実行（保存値を読み込むのに利用）
- `return (...)` は C の return と違って「UIの設計図(JSX)」を返す
- `export default function App()` は「このファイルの代表輸出 = アプリの入口」

---

## 今後のTODO
- Virtual DOM / 差分更新の仕組みをさらに深掘り
- GitHub に App.js やコード一式を push
- API 通信や外部データ取得の練習
- Android 実機での動作確認も追加

