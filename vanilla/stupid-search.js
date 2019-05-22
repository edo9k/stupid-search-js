/*
 * @prettier
 */

let BOOK = [] // all books go in here

const loadTexts = async () => {
  let books = []
  let files

  // load description file
  try {
    const jsonFile = await fetch('./capitulos.json')
    files = await jsonFile.json()
  } catch (e) {
    console.error({
      message: 'Erro ao carregar <capitulos.json>',
      error: e
    })
  }

  // load and parse files
  try {
    files.forEach(async chapter => {
      const response = await fetch(chapter.arquivo)
      const text = await response.text()
      books.push({
        title: chapter.titulo,
        subtitle: chapter.subtitulo,
        file: chapter.arquivo,
        text: stripHTML(text)
      })
    })

    BOOK = books
  } catch (e) {
    console.error({
      message: 'Erro ao carregar os capítulos do livro.',
      error: e
    })
  }
}

/*
 * character/text cleanup
 */
const cleanTexts = () => {
  BOOK.forEach(async el => {
    if (!el.cleanText) {
      el.text = stripHTML(el.text)
      el.cleanText = await clean(el.text)
    }
  })
}

const replaceBrChars = async text => {
  return text
    .replace(/[áàãâä]/iu, 'a')
    .replace(/[éèêë]/iu, 'e')
    .replace(/[íìîï]/iu, 'i')
    .replace(/[óòõôö]/iu, 'o')
    .replace(/[úùûü]/iu, 'u')
    .replace(/[ç]/iu, 'c')
}

const stripHTML = text => {
  if (!text && typeof text !== 'string') return ''

  const bodyBegin = text.indexOf('<body>')
  const bodyEnd = text.indexOf('</body>')

  if (bodyBegin === -1 && bodyEnd === -1) return ''

  const tmp = document.createElement('html')

  tmp.innerHTML = text.substring(bodyBegin, bodyEnd)

  return tmp.innerText
}

// prettier-ignore
const clean = async text => {
  return await stripHTML(
    await replaceBrChars(
      text.toLowerCase()
  ))
}

const queryRegex = w => {
  return new RegExp(w, 'gi')
}

/*
 * simple search loop
 */
const search = async searchQuery => {
  if (!searchQuery || searchQuery.length < 4) {
    console.log('No mínimo quatro caracteres pra fazer a pesquisa')
    return false
  }

  corpus.cleanText = await clean(corpus.text)

  searchQuery = await clean(searchQuery)
  searchQuery = queryRegex(searchQuery)

  const indices = []
  let result = null

  addSection(corpus.subtitulo) // mudar para corpus.titulo

  while ((result = searchQuery.exec(corpus.cleanText))) {
    indices.push(result.index)

    addResult(
      `...${corpus.text.substring(result.index - 20, result.index + 20)}...`,
      `${corpus.arquivo}?preambule=${corpus.text.substring(result.index - 20, result.index - 1)}&word=${searchQuery}`
    )
  }
}
/*
 * user interface functions
 */
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

const addSection = text => {
  const item = document.createElement('h2')
  const itemText = document.createTextNode(text)

  item.appendChild(itemText)

  document.getElementById('result').appendChild(item)
}

const cleanResults = () => {
  let node = document.getElementById('result')
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

/*
 * param/route functions
 */
const setParam = w => {
  let params = new URLSearchParams(window.location.search)

  params.set('query', w)
  history.pushState(null, `Pesquisa: ${w}`, `?query=${params.get('query')}`)
}

const getParam = () => {
  let params = new URLSearchParams(window.location.search)

  return params.get('query')
}

const checkParamSearch = () => {
  const urlQuery = getParam()
  if (urlQuery) {
    document.getElementById('searchText').value = urlQuery

    search(urlQuery, files[0])
  }
}

/*
 * set events up
 */
const setupEvents = () => {
  document.getElementById('searchButton').onclick = async () => {
    let query = document.getElementById('seachText').value

    cleanResults()
    setParams(query)
    await search(query, files[0])
  }

  document.getElementById('searchText').addEventListener('keyup', event => {
    event.preventDefault()
    if (event.keyCode === 13) {
      document.getElementById('searchButton').click()
    }
  })
}

const main = async () => {
  await loadTexts()
  setupEvents()

  // load all texts
  //const doc = await fetch('./dom-casmurro.html')
  //const text = await doc.text()
  /*

  let files
  checkParamSearch()
  */
}

// calls main when document is loaded
document.addEventListener('DOMContentLoaded', async () => {
  await main()
})
