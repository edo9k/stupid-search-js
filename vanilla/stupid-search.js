/*
 * @prettier
 */

let book = {}

const replaceBrChars = async t =>
  t
    .replace(/[áàãâä]/iu, 'a')
    .replace(/[éèêë]/iu, 'e')
    .replace(/[íìîï]/iu, 'i')
    .replace(/[óòõôö]/iu, 'o')
    .replace(/[úùûü]/iu, 'u')
    .replace(/[ç]/iu, 'c')
// .replace(/[^a-z0-9]/i, '_')
// .replace(/_+/, '_')

const clean = async t => await replaceBrChars(t.toLowerCase())

const query = w => new RegExp(w, 'gi')

const search = async (q, s) => {
  const a = Date.now()
  const indices = []
  let regex = await replaceBrChars(q.toLowerCase())
  regex = query(regex)
  book.cleanText = replaceBrChars(s)
  let result = null

  while ((result = regex.exec(s))) {
    indices.push(result.index)

    addResult(
      `...${book.text.substring(result.index - 20, result.index + 20)}...`,
      `${book.url}?preambule=${book.text.substring(result.index - 20, result.index - 1)}&word=${q}`
    )

    //        ...${book.text.substring(result.index - 50, result.index + 0)}...
    //        (encontrado em ${(Date.now() - a) / 1000} segundo/s)
  }
  //  ` ${indices.length} resultados encotrados. `
}

const cleanResults = () => {
  let node = document.getElementById('result')
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

const addResult = (text, link) => {
  const item = document.createElement('li')
  const itemText = document.createTextNode(text)

  const a = document.createElement('a')
  const aText = document.createTextNode('[ir]')
  a.appendChild(aText)
  a.title = 'pular para esse trecho'
  a.href = link

  item.appendChild(itemText)
  item.appendChild(a)

  document.getElementById('result').appendChild(item)
}

const setParam = w => {
  let params = new URLSearchParams(window.location.search)

  params.set('query', w)
  history.pushState(null, `Pesquisa: ${w}`, `?query=${params.get('query')}`)
}

const getParam = () => {
  let params = new URLSearchParams(window.location.search)

  return params.get('query')
}

const main = async () => {
  // setup inputs
  document.getElementById('searchButton').onclick = () => {
    let query = document.getElementById('searchText').value

    cleanResults()
    setParam(query)
    search(query, book.text)
  }
  // load all texts
  const doc = await fetch('./dom-casmurro.html')
  const text = await doc.text()

  book.url = './dom-casmurro.html'
  book.text = text

  let urlQuery = getParam()
  if (urlQuery) {
    document.getElementById('searchText').value = urlQuery
    search(urlQuery, book.text)
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await main()
})

/*
  (async () => {
    const rawargs = process.argv
    const args = rawargs.slice(2)
    const searchText = await clean(book.text.toLowerCase())


    const searchQuery = args
      .map(x => x.toString().trim())
      .join(' ')


    if (typeof searchQuery === 'string'
        && searchQuery.trim() !== ''
        && searchQuery.length > 3 ) {
      await search( searchQuery, searchText )
    } else {
      console.error(`
        Search queries must be:
          - String type (text)
          - Non empty
          - Longer than 3 characters

        Please try again.
      `)
    }


        searchQuery ----------------------  ${ searchQuery}
        searchQuery sanitized ------------  ${ await replaceBrChars(searchQuery.toLowerCase())}
        && typeof searchQuery === 'string'  ${ typeof searchQuery === 'string'}
        && searchQuery.trim() !== '' -----  ${ searchQuery.trim() !== '' }
        && searchQuery.length > 2 --------  ${ searchQuery.length > 2 }

    */
