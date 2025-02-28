# メシイクのバックエンドサーバー
[メシイクアプリ](https://github.com/meshiiku/prototype_v1)のプロトタイプ用のバックエンドサーバーです。
```
フレームワーク: Hono v4.7.2
ランタイム: Bun
データベース: PostgreSQL + PrismaORM
Nix: 24.05
```
# 開発環境
開発環境の統一のため、`direnv`と`Nix`パッケージマネージャを導入しています。<br>
下記のコマンドで、データベース(`PostgreSQL`)の初期化とランタイムの、依存関係のインストールが完了します。

```sh
git clone https://github.com/meshiiku/prototype_v1-server
cd prototype_v1-server
direnv allow 
push #　マイグレーションの実行
pg-start #バッググラウンドでpostgreを実行
run # サーバーの実行
```
# 環境変数
新たにプロジェクト直下に`.env`を作成し以下のような環境変数を作成します。
- `GOOGLE_API_KEY`: バックエンドサーバーのエージェント処理部分で`gemini-2.0-flash-lite`を使っているため必要です。APIの取得はGoogle AI Studioから簡単に取得可能です。
- `HOTPEPPER_API_KEY`: リクルート様のグルメサーチAPIをツールとして使っているため必要です。
```
GOOGLE_API_KEY=AIz******************* # Gemini API
HOTPEPPER_API_KEY=3jf3*************** # HotpepperAPI
```
# 技術スタック
- Hono
- Zod
- PostgreSQL
- PrismaORM
- Nix
- LangChain
- LangGraph
