# ImagePetaPeta
## ダウンロード
<https://github.com/takumus/ImagePetaPeta/releases/tag/1.5.0-beta>
## インストール
下図ような警告が出ますが、赤い枠のボタンを押せばインストールできます。  
この警告は、私が**EVコードサイニング証明書**を取得すれば消えるのですが、  
法人でないと取得できないため出てしまいます。あと取得に結構お金がかかります(;o;)  
お金持ちになって法人登記したら考えます！
![1](./README/1.png)
![2](./README/2.png)
## 使い方
### 画像の追加
- 画像をドラッグ・アンド・ドロップ（**ブラウザから直接も可能**）または**画像を読み込む**で追加します。
- 大体の画像ファイルに対応しています。
- 画像ファイルは専用フォルダにコピーされます。（**情報**から**データベースフォルダ**で専用フォルダが開けます）
### ブラウザ
- **ブラウザを開く**で取り込まれた画像が表示されます。
- 画像をドラッグすると、ボードに追加されます。
- 画像をクリックすると選択状態になります。
- 選択状態で、右側の**クリックでタグ追加**より、その画像に対して**タグ**が追加できます。
- **タグ**に使える文字はスペース以外全てです。
- 追加された**タグ**は左側から絞り込めます。(Shiftを押しながら**タグ**を選ぶと複数条件になります)
- **タグ**を右クリックで**削除**を選べば消えます。
- **タグ**をリネームしたい場合、ダブルクリックでリネームできます。
- 画像を右クリックで削除できます。
- **Ctrl + A**で全選択できます。
- **Shift**, **Control**で複数選択できます。
- **閉じる**で**ブラウザ**を閉じます。
### ボード
- 追加した画像の拡大縮小回転ができます。
- 画像を右クリックメニューで、左右反転上下反転ができます。
- 画像を右クリックメニューで**トリミング**をする事で、トリミングができます。
- 背景をドラッグするとボード自体の移動ができます。
- マウスホイールでズーム出来ます。
- ダブルクリックまたは右クリックメニューから**位置をリセット**でボード位置のリセットができます。
### 設定
- 左下の**設定**から開けます。
### 保存について
- 自動保存です。
- 操作が無くなって１秒後に自動保存します。
## ご協力
ベータ版ではバグの早期発見のためログファイルを保存しています。  
ログファイルの場所は、左下の**情報**より、**データベースフォルダ**で開いたフォルダ内の**logs.log**です。  
自動でオンラインにアップロードしたりする事は無いのでご安心ください。  
このソフトは、起動時のアップデートチェック・ブラウザからの画像追加以外でオンラインに接続しません。
## バグ発見！質問！または要望！
<https://github.com/takumus/ImagePetaPeta/issues>  
こちらより**New Issue**で投稿してください。  
githubアカウントが無い場合は<https://github.com/takumus>のメールアドレスまで！
# 開発者向け

## デバッグ
```
yarn serve
```

## ビルド
```
yarn build
```
