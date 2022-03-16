set -e
set -x

BRANCH=$(git symbolic-ref --short HEAD)

npm run lint

if [ $BRANCH == 'main' ]; then
  npx lerna version --conventional-commits --conventional-graduate --yes
else
  npx lerna version --conventional-commits --conventional-prerelease --preid beta --yes
fi

npx lerna publish from-package --yes
