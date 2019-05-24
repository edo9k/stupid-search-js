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
    // ao invés de imprimir, gerar um erro novo e retornar ele
    console.error({
      message: 'Erro ao carregar <capitulos.json>',
      error: e
    })
    return
  }

  // load and parse files
  try {
    await Promise.all(
      files.map(async chapter => {
        const response = await fetch(chapter.arquivo)
        const text = await response.text()
        books.push({
          title: chapter.titulo,
          subtitle: chapter.subtitulo,
          file: chapter.arquivo,
          text: removeLineBreaks(await stripHTML(text))
        })
      })
    )

    BOOK = books
  } catch (e) {
    // mesmo esquema do try-catch anterior
    console.error({
      message: 'Erro ao carregar os capítulos do livro.',
      error: e
    })
  }
}

/*
 * character/text cleanup
 */
const cleanTexts = async () => {
  BOOK.forEach(async (el, index) => {
    if (!el.cleanText) {
      BOOK[index].cleanText = await clean(el.text)
    }
  })
}

const replaceBrChars = async text => {
  return text
    .replace(/[áàãâä]/giu, 'a')
    .replace(/[éèêë]/giu, 'e')
    .replace(/[íìîï]/giu, 'i')
    .replace(/[óòõôö]/giu, 'o')
    .replace(/[úùûü]/giu, 'u')
    .replace(/[ç]/giu, 'c')
}

const removeLineBreaks = text => {
  return text.replace(/\n+/giu, '\n')
}

const stripHTML = async text => {
  // retornar erro???
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
  let a = text.toLowerCase()
  let b = await replaceBrChars(a)

  return b
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

  cleanResults()

  searchRegex = queryRegex(await clean(searchQuery))

  for (chapter of BOOK) {
    const indices = []
    let result = null

    addSection(chapter.title) // mudar para corpus.titulo

    while ((result = searchRegex.exec(chapter.cleanText))) {
      indices.push(result.index)

      addResult(
        `...${chapter.text.substring(result.index - 20, result.index + 20)}...`,
        `${chapter.file}?preambule=${chapter.text.substring(result.index - 20, result.index - 1)}&word=${searchQuery}`
      )
    }
  }
}

/*
 * user interface functions
 */

const showSearchUI = () => {
  isLoading.style.display = 'none'
  searchArea.style.display = 'block'
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

const checkParamSearch = async () => {
  const urlQuery = getParam()
  if (urlQuery) {
    document.getElementById('searchText').value = urlQuery

    await search(urlQuery)
  }
}

/*
 * set events up
 */
const setupEvents = () => {
  document.getElementById('searchButton').onclick = async () => {
    let query = document.getElementById('searchText').value

    cleanResults()
    setParam(query)

    await search(query)
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
  await cleanTexts()
  setupEvents()
  showSearchUI()

  await checkParamSearch()
}

// calls main when document is loaded
document.addEventListener('DOMContentLoaded', async () => {
  await main()
})
