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



# [Work in progress] Azure + Terraform によるインフラ管理
### **(1) 使用検討中の Azure サービス**

#### **コンテンツ配信 & 負荷分散**
- **Azure CDN**: 静的ソースのキャッシュ
- **Azure Front Door**: API のルーティング & 負荷分散

#### **認証・ユーザー管理**
- **Azure AD B2C**: ユーザー認証

#### **API & サーバーレス**
- **Azure Functions**: サーバーレス API
- **Azure API Management**: API ゲートウェイ & Rate Limiting
- **Cloudflare Workers**: 軽量 API や単純な処理をこちらで実行 (コスト削減のため)

#### **イベント駆動**
- **Azure Event Grid**: イベント駆動の処理実行

#### **データ管理**
- **Azure Database for PostgreSQL**: 位置情報 & ユーザーデータ管理
- **Azure Cosmos DB**: セッション管理 (NoSQL)
- **Azure Blob Storage**: 画像・ログデータの保存 (S3 相当)
- **Azure Cache for Redis**: データキャッシュ

#### **位置情報・通知**
- **Azure Maps**: 位置情報管理 & Geo-fencing
- **Azure Notification Hubs**: プッシュ通知

#### **支援系 (CI/CD・監視・インフラ管理)**
- **Azure DevOps**: CI/CD パイプライン管理
- **Azure Monitor & Application Insights**: API のパフォーマンス監視
- **Terraform / Bicep**: インフラ管理

#### **Web 版のホスティング**
- **Azure Static Web Apps**: Flutter Web のホスティング

### **(2) Terraform の管理構成**
Terraform では、以下のディレクトリ構成で管理します。

```
/terraform
  ├── modules
  │   ├── app_service.tf
  │   ├── database.tf
  │   ├── apim.tf
  │   ├── storage.tf
  │   ├── frontdoor.tf
  │   ├── redis.tf
  │   ├── functions.tf
  ├── environments
  │   ├── dev.tfvars
  │   ├── staging.tfvars
  │   ├── prod.tfvars
  ├── main.tf
  ├── variables.tf
  ├── providers.tf
  ├── backend.tf
```


# 今後の対応
- [ ] **Azure のリソース最適化**
- [ ] **Terraform モジュールの最適化**
- [ ] **CI/CD の強化**
- [ ] **Azure CLI でのローカル対応の強化**
  - [ ] **ローカル開発環境での Azure CLI 設定**
  - [ ] **Azure ログインのスクリプト化**
  - [ ] **ローカル環境でのリソース管理（VM, ストレージ, App Service）**
  - [ ] **ローカル環境での Azure Functions のデプロイ・デバッグ**
  - [ ] **ローカル環境での Azure Container Apps の開発**
  - [ ] **Azure CLI による Terraform の適用・検証**