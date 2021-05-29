### Next2ts

Migrate your Next.js Project from javaScript to typescript in seconds

### Get started


Make sure you are inside a next.js Project


Execute


```bash
npx next2ts
```
or

```bash
pnpx next2ts
```


### What does it do



- It moves file these directories to typescript respectively.

```
  components
    |
    |__ jsx,js --> tsx

  lib
    |
    |
    |__ js --> ts

  pages or src/pages
    |
    |__api
    |   |
    |   |__.js --> .ts
    |
    |_____.jsx,.js -> .tsx
```

- Installs all necessary packages.
- sets up  standard `tsconfig.json` for next.js apps
- Have any idea to add one file an Issue or PR


### Licence

This project is under [MIT](https://github.com/makuzaverite/next2ts) Licence
