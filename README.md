# Subs-Savvy

## Init Project

clone the source code

```bash
git clone https://github.com/vorant94/subs-savvy.git
cd subs-savvy
git remote add wiki https://github.com/vorant94/subs-savvy.wiki.git
git fetch --all
```

setup Node via Homebrew

```bash
brew install node@20
```

_OR_ setup Node via NVM

```bash
 brew install nvm
 nvm install
 nvm use
```

install dependencies

```bash
npm i
npm run e2e:setup
```

## Push Changes

> [!IMPORTANT]
> One commit should never combine both source code and docs changes

push source code changes

```bash
git push
```

push docs changes

```bash
git subtree push --prefix docs wiki master
```
