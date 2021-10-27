#!/bin/sh

# PHPビルドインサーバーの起動
php -S localhost:8000 -t ./docs

# 完了
echo "PHP in Server start!"
