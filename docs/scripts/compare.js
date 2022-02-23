const dircompare = require('dir-compare');
const path = require('path');

/**
 * register default locale
 */
const enDocs = path.resolve('docs');
const enBlog = path.resolve("blog");
const replacePath = path.resolve(".")

/**
 * register Chinese
 */
const zhDocs = path.resolve("i18n/zh/docusaurus-plugin-content-docs/current")
const zhBlog = path.resolve("i18n/zh/docusaurus-plugin-content-blog")


/**
 * compare directory
 */
const docsResult = dircompare.compareSync(zhDocs, enDocs)
const blogResult = dircompare.compareSync(zhBlog, enBlog)

if (docsResult.same) {
  console.log('****** All docs has i18n ******')
} else {
  console.log('xxxxxxxxxxxxxxxxxxxx')
  console.log('No i18n file: ')
  console.log('xxxxxxxxxxxxxxxxxxxx')
  console.log(docsResult.diffSet.filter((item) => item.state !== 'equal').map((item) => `${item.path2}/${item.name2}`))
  process.exit(1)
}

if (blogResult.same) {
  console.log('****** All blog has i18n ******')
} else {
  console.log('xxxxxxxxxxxxxxxxxxxx')
  console.log('No i18n file: ')
  console.log('xxxxxxxxxxxxxxxxxxxx')
  console.log(blog.diffSet.filter((item) => item.state !== 'equal').map((item) => `${item.path2}/${item.name2}`))
  process.exit(1)
}
