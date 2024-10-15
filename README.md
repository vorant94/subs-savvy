# Subs-Savvy

![CI/CD](https://github.com/vorant94/subs-savvy/actions/workflows/ci-cd.yml/badge.svg)
![GitHub License](https://img.shields.io/github/license/vorant94/subs-savvy)
[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

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
brew install node@22
```

install dependencies

```bash
npm i
npx playwright install
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
