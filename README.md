# MiniMax H3 × Remotion — X紹介動画

人物は動画生成、スマホ操作はReact/Remotionで制作した48秒の縦動画です。制作時のv2ソースを、別の環境でも実行できる形に整えています。

かな入力・変換候補・送信・既読、アプリ切り替え、URLのコピーと貼り付け、左側からの画像受信を再現します。実際のLINEやXを操作するアプリではなく、台本に沿って描画する映像です。

## バージョンを選ぶ

| バージョン | 内容 | ソース |
| --- | --- | --- |
| v1 | 初版。全面スマホUI、初版の人物素材、操作音 | [v1](https://github.com/zumuzmjp/chikaidev-x-intro/tree/v1) |
| v2 | 余白・実アイコン・入力UI・左側の画像受信・新しい人物素材・ピアノBGM | [v2](https://github.com/zumuzmjp/chikaidev-x-intro/tree/v2) |

[v1→v2のコード差分](https://github.com/zumuzmjp/chikaidev-x-intro/compare/v1...v2)

```bash
# 初版を使う
 git clone --branch v1 https://github.com/zumuzmjp/chikaidev-x-intro.git
# 修正版を使う場合は --branch v2
```

v1は保存されていた初版ZIPから復元し、v2のコミットの親として登録しました。既存mainの履歴は書き換えていません。初版には後から修正されたUIの不正確さが残っています。

## はじめ方

必要：Node.js 20以上、Python 3、FFmpeg、Chromiumが動く環境。

```bash
npm ci
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
npm run studio
```

Windowsでは仮想環境を `.venv\Scripts\activate` で有効にします。Pythonの実行名が `python` の場合はpackage.jsonの `python3` を変更してください。

Studioで `ChikaidevIntro` を開きます。初回はRemotionがブラウザをダウンロードする場合があります。最終レンダラーで既存ブラウザを使う場合は `REMOTION_BROWSER_EXECUTABLE` に実行ファイルの絶対パスを設定します。

```bash
# 20秒のフレームを確認
npm run still
# 操作音・ピアノBGMを生成し、完成動画を書き出す
npm run render
```

完成動画：`out/chikaidev-x-intro.mp4`（720×1280、30fps、48秒、H.264/AAC）。音声は最後にFFmpegで合成するため、Studioの映像プレビューは無音です。

## 自分の動画に変える

| 変更したいもの | 場所 |
| --- | --- |
| 名前・プロフィール | `src/index.tsx` の `P` と `ProfileCard` |
| 会話と送信時刻 | 同ファイルの `messages` |
| URL・検索文字・紹介文 | 同ファイル内の `chikaidev`、`布施千佳純`、日本語の表示文言 |
| プロフィール画像 | `public/avatar.jpg`、`public/banner.jpg` |
| 人物映像 | `public/human.mp4` |
| 通知・入力・送受信音 | `audio.py` の時刻配列 |
| BGM | `music.py` のコード進行・旋律・音量 |
| 余白と倍率 | `src/index.tsx` の `Film` |

入力は `start` から `end` まで、送信は `at`。`kana` が変換前、`text` が確定後です。台詞を変えたら `audio.py` の入力音の時刻も調整してください。現状は48秒専用です。

紹介先は一か所の設定だけでは切り替わりません。`chikaidev` と名前を全文検索して、プロフィールカードやブラウザ表示も置き換えてください。入力途中・アプリ切り替え途中・画像受信後を確認すると崩れを見つけやすくなります。

## 制作手順

1. 参考動画をフレームで確認し、会話・入力・画面遷移を分析。
2. HiggsfieldのMiniMax H3で人物素材を9:16・2K・6秒生成。必要な部分を使用。
3. RemotionでUI、かな変換、送信後の反応、27フレームのアプリ切り替えを実装。
4. スマホを黒い余白の中へ配置し、キーボード比率と画像の送信者を修正。
5. Pythonで操作音とピアノ曲を作り、FFmpegで映像と合成。

人物生成の指示例（元のAPI入力そのものではなく、制作メモから整理）：

> 21歳の成人女性。縦型の自撮り映像。手のひらでレンズを覆った状態から手を引き、顔をカメラへ寄せ、通知に反応する。自然な表情と動き。

生成済み素材を使用する構成です。Higgsfield API連携や動画生成の自動実行は含みません。

[短い制作記事](docs/making-of.md) / [計測値と修正メモ](chikaidev-video-analysis.md)

参考：[砂川さんの投稿](https://x.com/nobuo_sunagawa/status/2097485457856881132)。元動画と切り出し画像は同梱していません。

## ライセンス

オリジナルコードは[ISC](LICENSE)。フォント・音源・ブランド素材・人物映像はコードのライセンスとは区別します。[素材の出典](ASSETS.md)を確認してください。
