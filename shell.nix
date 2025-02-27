{
  pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/refs/tags/24.05.zip") { },
}:
pkgs.mkShell {
  buildInputs = with pkgs; [
    bun
    zsh
    starship
    postgresql
  ];

  shellHook = ''
    echo  "パッケージをインストール中..."
    mkdir logs
    bun i 
    bun --version
    # データベース存在チェック
    if [ ! -d "./pgdata" ]; then
      echo "データベースを初期化中..."
      initdb -D ./pgdata # データベースの初期化

      if  pg_ctl -D ./pgdata status > /dev/null 2>&1; then
        pg_ctl -D ./pgdata stop # Postgreが生きてたら止める
      fi

      pg_ctl -D ./pgdata -l logs/postgre start # PostgreSQL 起動

      # 'user'アカウントを指定して、新しいアカウント「dev」を作成
      psql -U user -d postgres -c "CREATE ROLE dev WITH LOGIN PASSWORD 'password' CREATEDB;"
      psql -U user -d postgres -c "CREATE DATABASE db OWNER dev;"

      pg_ctl -D ./pgdata stop # PostgreSQL 停止
    fi
    chmod +x bin/*
    PATH_add bin # https://github.com/direnv/direnv/issues/109
  '';
}
