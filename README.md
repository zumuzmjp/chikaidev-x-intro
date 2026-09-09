# Chikaidev X Intro

48-second Remotion + MiniMax H3 video. Japanese fictional conversation, real public profile snapshot dated 2026-09-09.

Requires Node.js 20+, Python 3 + numpy, ffmpeg. Run `npm ci`, then `npm run render`. Output: `out/chikaidev-x-intro.mp4`.

Set REMOTION_BROWSER_EXECUTABLE if using an existing Chromium. Otherwise Remotion downloads its browser.

Edit messages and timings in src/index.tsx. All times are seconds at 30fps. H3 source is public/human.mp4. Detailed analysis in chikaidev-video-analysis.md. Uploaded copies of the reference video and account data are not included. Avatar and banner are profile assets supplied by the user's public account. Noto Sans JP is covered by public/FONT-LICENSE.txt.


## v1原本の復元

このブランチは制作時に保存した初版ZIPから復元しています。src/index.tsx・render.cjs・audio.pyと人物素材は初版原本と同じです。v2は [v2ブランチ](https://github.com/zumuzmjp/chikaidev-x-intro/tree/v2) を参照してください。

初回は `python3 -m pip install numpy` と `mkdir -p out` を実行してください。`npm run render` は操作音を生成して合成します。v1にはピアノBGMがありません。

配布時に参考元の切り出し画像、生成済みWAV、検証出力を除外し、コード用ISCライセンスと.gitignoreを追加しました。画像・人物映像・フォントはコードのISCライセンスとは別です。プロフィール画像は自分の素材に差し替え、フォントのFONT-LICENSE.txtを保持してください。
