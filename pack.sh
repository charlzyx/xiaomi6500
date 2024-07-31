bun run docs:build

cd .vitepress
tar -cvf dist.tar dist/

rm -rf dist
